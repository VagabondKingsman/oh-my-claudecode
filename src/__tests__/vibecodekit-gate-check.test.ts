import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT_PATH = join(process.cwd(), 'scripts', 'vibecodekit-gate-check.mjs');
const NODE = process.execPath;

interface RunResult {
  stdout: string;
  exitCode: number;
  summary: string;
}

function runScript(args: string[], workDir: string, extraEnv: NodeJS.ProcessEnv = {}): RunResult {
  const summaryFile = join(workDir, 'step-summary.md');
  writeFileSync(summaryFile, '');
  let stdout = '';
  let exitCode = 0;
  try {
    stdout = execFileSync(NODE, [SCRIPT_PATH, ...args], {
      encoding: 'utf-8',
      env: {
        ...process.env,
        GITHUB_STEP_SUMMARY: summaryFile,
        GITHUB_WORKSPACE: workDir,
        VCK_STRICT: '',
        VCK_DELIVERABLES_PATH: '',
        ...extraEnv,
      },
      timeout: 10_000,
    });
  } catch (err) {
    const typed = err as { status?: number; stdout?: Buffer; stderr?: Buffer };
    exitCode = typed.status ?? 1;
    stdout = typed.stdout?.toString('utf-8') ?? '';
  }
  const summary = readFileSync(summaryFile, 'utf-8');
  return { stdout, exitCode, summary };
}

describe('scripts/vibecodekit-gate-check.mjs', () => {
  let workDir: string;

  beforeEach(() => {
    workDir = mkdtempSync(join(tmpdir(), 'vck-gate-check-'));
    mkdirSync(join(workDir, '.omc'), { recursive: true });
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  it('returns neutral + exit 0 when deliverables.json is absent', () => {
    const r = runScript([], workDir);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain('no deliverables.json');
    expect(r.summary).toContain('no deliverables.json');
    expect(r.summary).toContain('Path checked');
  });

  it('returns success + exit 0 for a SHIP gate', () => {
    writeFileSync(
      join(workDir, '.omc/deliverables.json'),
      JSON.stringify({
        slug: 'demo',
        verify_gate: '🟢',
        release_decision: 'SHIP',
        verdict_counts: { pass: 36, fail: 0, painful: 0, missing: 0 },
        rri_t_gate: '🟢',
        rri_ux_gate: '🟢',
      }),
    );
    const r = runScript([], workDir);
    expect(r.exitCode).toBe(0);
    expect(r.summary).toContain('🟢 SHIP');
    expect(r.summary).toContain('demo');
    expect(r.summary).toMatch(/\| 36 \| 0 \| 0 \| 0 \|/);
  });

  it('returns neutral + exit 0 for a SHIP_WITH_FOLLOWUPS gate by default', () => {
    writeFileSync(
      join(workDir, '.omc/deliverables.json'),
      JSON.stringify({
        slug: 'landing',
        verify_gate: '🟡',
        release_decision: 'SHIP_WITH_FOLLOWUPS',
        verdict_counts: { pass: 18, fail: 0, painful: 2, missing: 0 },
      }),
    );
    const r = runScript([], workDir);
    expect(r.exitCode).toBe(0);
    expect(r.summary).toContain('🟡 SHIP_WITH_FOLLOWUPS');
  });

  it('returns failure + exit 1 for a SHIP_WITH_FOLLOWUPS gate with --strict', () => {
    writeFileSync(
      join(workDir, '.omc/deliverables.json'),
      JSON.stringify({
        slug: 'landing',
        verify_gate: '🟡',
        release_decision: 'SHIP_WITH_FOLLOWUPS',
        verdict_counts: { pass: 18, fail: 0, painful: 2, missing: 0 },
      }),
    );
    const r = runScript(['--strict'], workDir);
    expect(r.exitCode).toBe(1);
    expect(r.summary).toContain('🟡 SHIP_WITH_FOLLOWUPS');
  });

  it('returns failure + exit 1 for a DO_NOT_SHIP gate', () => {
    writeFileSync(
      join(workDir, '.omc/deliverables.json'),
      JSON.stringify({
        slug: 'broken',
        verify_gate: '🔴',
        release_decision: 'DO_NOT_SHIP',
        verdict_counts: { pass: 3, fail: 4, painful: 1, missing: 0 },
      }),
    );
    const r = runScript([], workDir);
    expect(r.exitCode).toBe(1);
    expect(r.summary).toContain('🔴 DO_NOT_SHIP');
    expect(r.summary).toMatch(/\| 3 \| 4 \| 1 \| 0 \|/);
  });

  it('handles malformed JSON gracefully (treated as absent)', () => {
    writeFileSync(join(workDir, '.omc/deliverables.json'), '{ not valid');
    const r = runScript([], workDir);
    expect(r.exitCode).toBe(0);
    expect(r.summary).toContain('no deliverables.json');
    expect(r.summary).toContain('unparseable');
  });

  it('--json emits a structured decision on stdout', () => {
    writeFileSync(
      join(workDir, '.omc/deliverables.json'),
      JSON.stringify({
        slug: 'demo',
        verify_gate: '🟢',
        release_decision: 'SHIP',
        verdict_counts: { pass: 10, fail: 0, painful: 0, missing: 0 },
      }),
    );
    const r = runScript(['--json'], workDir);
    expect(r.exitCode).toBe(0);
    const parsed = JSON.parse(r.stdout.trim());
    expect(parsed).toMatchObject({
      present: true,
      conclusion: 'success',
      exitCode: 0,
      gate: '🟢',
      decision: 'SHIP',
      slug: 'demo',
    });
  });

  it('honors VCK_DELIVERABLES_PATH env override', () => {
    const altFile = join(workDir, 'custom-deliverables.json');
    writeFileSync(
      altFile,
      JSON.stringify({ verify_gate: '🟢', release_decision: 'SHIP' }),
    );
    const r = runScript([], workDir, { VCK_DELIVERABLES_PATH: altFile });
    expect(r.exitCode).toBe(0);
    expect(r.summary).toContain('🟢 SHIP');
  });

  it('honors VCK_STRICT=1 env override', () => {
    writeFileSync(
      join(workDir, '.omc/deliverables.json'),
      JSON.stringify({ verify_gate: '🟡', release_decision: 'SHIP_WITH_FOLLOWUPS' }),
    );
    const r = runScript([], workDir, { VCK_STRICT: '1' });
    expect(r.exitCode).toBe(1);
  });
});
