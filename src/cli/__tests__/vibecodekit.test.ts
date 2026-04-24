/**
 * `omc vibecodekit` CLI smoke tests.
 *
 * Verifies the thin dispatcher for the vibecodekit-hybrid preset:
 *   - help output
 *   - scaffold creates canonical .omc/ artifact skeleton + deliverables.json
 *   - status reads deliverables.json
 *   - patterns lists vision patterns
 *   - locales lists available overlay languages
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = join(__dirname, '../../..');
const CLI_ENTRY = join(PLUGIN_ROOT, 'bridge/cli.cjs');

// CI's `test` job does not run `npm run build` first, so the CLI bridge may be
// missing when vitest starts. Build it once here so the subprocess tests work
// in both local and CI environments. Safe for local: noop when the file exists.
beforeAll(() => {
  if (existsSync(CLI_ENTRY)) return;
  execFileSync('node', [join(PLUGIN_ROOT, 'scripts/build-cli.mjs')], {
    cwd: PLUGIN_ROOT,
    stdio: 'inherit',
    timeout: 120_000,
  });
}, 180_000);

function runCli(args: string[], cwd: string): { stdout: string; stderr: string; status: number } {
  try {
    const stdout = execFileSync('node', [CLI_ENTRY, ...args], {
      cwd,
      encoding: 'utf-8',
      env: { ...process.env, OMC_PLUGIN_ROOT: PLUGIN_ROOT },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { stdout, stderr: '', status: 0 };
  } catch (err) {
    const e = err as { stdout?: Buffer; stderr?: Buffer; status?: number };
    return {
      stdout: e.stdout?.toString() ?? '',
      stderr: e.stderr?.toString() ?? '',
      status: e.status ?? 1,
    };
  }
}

describe('omc vibecodekit CLI', () => {
  let workDir: string;

  beforeEach(() => {
    workDir = mkdtempSync(join(tmpdir(), 'omc-vibe-'));
  });

  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  it('prints help when invoked with no subcommand', () => {
    const result = runCli(['vibecodekit'], workDir);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('omc vibecodekit');
    expect(result.stdout).toContain('scaffold');
    expect(result.stdout).toContain('status');
  });

  it('lists vision patterns', () => {
    const result = runCli(['vibecodekit', 'patterns'], workDir);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('landing');
    expect(result.stdout).toContain('saas');
    expect(result.stdout).toContain('dashboard');
    expect(result.stdout).toContain('custom');
  });

  it('lists the Phase 4b vision patterns (mobile-app, cli-tool, data-pipeline)', () => {
    const result = runCli(['vibecodekit', 'patterns'], workDir);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('mobile-app');
    expect(result.stdout).toContain('cli-tool');
    expect(result.stdout).toContain('data-pipeline');
  });

  it('lists available locales including vi overlay', () => {
    const result = runCli(['vibecodekit', 'locales'], workDir);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('en');
    expect(result.stdout).toContain('vi');
  });

  it('scaffold creates canonical artifact skeleton + deliverables.json', () => {
    const result = runCli(['vibecodekit', 'scaffold', 'checkout-flow'], workDir);
    expect(result.status).toBe(0);

    const expectedFiles = [
      '.omc/research/vibecodekit-hybrid-scan-checkout-flow.md',
      '.omc/specs/vibecodekit-hybrid-rri-checkout-flow.md',
      '.omc/plans/vibecodekit-hybrid-checkout-flow.md',
      '.omc/plans/vibecodekit-hybrid-verify-checkout-flow.md',
      '.omc/research/vibecodekit-hybrid-rri-ux-checkout-flow.md',
      '.omc/verify/vibecodekit-hybrid-rri-t-checkout-flow.md',
      '.omc/design/vibecodekit-hybrid-rri-ui-checkout-flow.md',
      '.omc/deliverables.json',
    ];
    for (const relPath of expectedFiles) {
      expect(existsSync(join(workDir, relPath)), `expected ${relPath} to be created`).toBe(true);
    }

    const deliverables = JSON.parse(
      readFileSync(join(workDir, '.omc/deliverables.json'), 'utf-8')
    ) as Record<string, unknown>;
    expect(deliverables.slug).toBe('checkout-flow');
    expect(deliverables.locale).toBe('en');
    expect(deliverables.verify_gate).toBeNull();
    expect(deliverables.release_decision).toBeNull();
  });

  it('scaffold --locale vi sets locale in deliverables.json', () => {
    runCli(['vibecodekit', 'scaffold', 'landing-vn', '--locale', 'vi'], workDir);
    const deliverables = JSON.parse(
      readFileSync(join(workDir, '.omc/deliverables.json'), 'utf-8')
    ) as Record<string, unknown>;
    expect(deliverables.locale).toBe('vi');
    expect(deliverables.slug).toBe('landing-vn');
  });

  it('scaffold slugifies noisy input', () => {
    runCli(['vibecodekit', 'scaffold', 'My Checkout Flow!! V2'], workDir);
    expect(
      existsSync(join(workDir, '.omc/plans/vibecodekit-hybrid-my-checkout-flow-v2.md'))
    ).toBe(true);
  });

  it('status reports the current gate values', () => {
    runCli(['vibecodekit', 'scaffold', 'saas-v1'], workDir);
    const result = runCli(['vibecodekit', 'status'], workDir);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('vibecodekit-hybrid status');
    expect(result.stdout).toContain('saas-v1');
    expect(result.stdout).toContain('verify_gate');
    expect(result.stdout).toContain('verdict_counts');
  });

  it('status exits non-zero when deliverables.json is missing', () => {
    // Make a fresh empty .omc dir without deliverables.json
    mkdirSync(join(workDir, '.omc'), { recursive: true });
    const result = runCli(['vibecodekit', 'status'], workDir);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('deliverables.json');
  });

  it('scaffold picks up OMC_LOCALE=vi when --locale is not passed', () => {
    const env = { ...process.env, OMC_LOCALE: 'vi', OMC_PLUGIN_ROOT: PLUGIN_ROOT };
    execFileSync('node', [CLI_ENTRY, 'vibecodekit', 'scaffold', 'locale-env-test'], {
      cwd: workDir,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const deliverables = JSON.parse(
      readFileSync(join(workDir, '.omc/deliverables.json'), 'utf-8')
    ) as Record<string, unknown>;
    expect(deliverables.locale).toBe('vi');
  });

  it('unknown subcommand exits non-zero with help', () => {
    const result = runCli(['vibecodekit', 'doesnotexist'], workDir);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Unknown subcommand');
  });
});
