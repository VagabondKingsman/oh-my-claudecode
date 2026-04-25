#!/usr/bin/env node

/**
 * Vibecodekit Hybrid — Release Gate CI Check (Phase 4a)
 *
 * Reads `.omc/deliverables.json` (the artifact produced by
 * `vibecodekit-hybrid-verify`) and turns it into a CI signal:
 *
 *   🟢 SHIP                  → exit 0,  conclusion=success
 *   🟡 SHIP_WITH_FOLLOWUPS   → exit 0,  conclusion=neutral  (exit 1 with --strict)
 *   🔴 DO_NOT_SHIP           → exit 1,  conclusion=failure
 *
 * When `.omc/deliverables.json` is missing or unparseable we exit 0 with
 * conclusion=neutral so this workflow never blocks repos that aren't
 * using the vibecodekit pipeline yet.
 *
 * When `$GITHUB_STEP_SUMMARY` is set we append a high-signal markdown
 * summary (gate glyph, verdict counts, sub-gates, slug). This is what the
 * "Vibecodekit Gate" check on the PR actually shows.
 *
 * Flags:
 *   --path <file>    Override the deliverables path (default: .omc/deliverables.json)
 *   --cwd <dir>      Override working directory
 *   --strict         Fail CI on 🟡 SHIP_WITH_FOLLOWUPS too
 *   --json           Print the parsed decision as JSON to stdout
 *
 * Env overrides:
 *   VCK_DELIVERABLES_PATH   Same as --path
 *   VCK_STRICT=1            Same as --strict
 *
 * This script has zero runtime dependencies so it can run on a bare
 * `actions/setup-node@v4` runner without `npm ci`.
 */

import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const GATE_GLYPHS = new Set(['🟢', '🟡', '🔴']);
const RELEASE_DECISIONS = new Set(['SHIP', 'SHIP_WITH_FOLLOWUPS', 'DO_NOT_SHIP']);

function parseArgs(argv) {
  const args = { path: null, cwd: null, strict: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--path' || a === '-p') args.path = argv[++i];
    else if (a === '--cwd') args.cwd = argv[++i];
    else if (a === '--strict') args.strict = true;
    else if (a === '--json') args.json = true;
    else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    }
  }
  return args;
}

function printHelp() {
  console.log(`vibecodekit-gate-check — read .omc/deliverables.json and emit a CI verdict

Usage:
  node scripts/vibecodekit-gate-check.mjs [--path <file>] [--cwd <dir>] [--strict] [--json]

Exit codes:
  0   gate is 🟢 SHIP or 🟡 SHIP_WITH_FOLLOWUPS (non-strict) or file is absent
  0   with --json prints the decision record on stdout
  1   gate is 🔴 DO_NOT_SHIP, or --strict and gate is 🟡`);
}

function normGate(raw) {
  if (typeof raw !== 'string') return null;
  const t = raw.trim();
  return GATE_GLYPHS.has(t) ? t : null;
}

function normDecision(raw) {
  if (typeof raw !== 'string') return null;
  const t = raw.trim().toUpperCase();
  return RELEASE_DECISIONS.has(t) ? t : null;
}

function safeNumber(raw) {
  return typeof raw === 'number' && Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 0;
}

/**
 * Evaluate a parsed deliverables object and return a structured decision.
 * Pure function — no filesystem access — so it is trivial to unit-test.
 *
 * @param {unknown} parsed - anything, including null / garbage
 * @param {{ strict?: boolean }} [opts]
 * @returns {{ present: boolean, conclusion: 'success'|'neutral'|'failure',
 *             exitCode: number, title: string, summary: string,
 *             gate: '🟢'|'🟡'|'🔴'|null,
 *             decision: 'SHIP'|'SHIP_WITH_FOLLOWUPS'|'DO_NOT_SHIP'|null,
 *             slug: string|null,
 *             counts: { pass: number, fail: number, painful: number, missing: number },
 *             rri: { t: string|null, ux: string|null, ui: string|null, sec: string|null } }}
 */
export function evaluateDeliverables(parsed, opts = {}) {
  const strict = opts.strict === true;
  const emptyTitle = 'Vibecodekit Gate — no deliverables.json';
  const empty = {
    present: false,
    conclusion: 'neutral',
    exitCode: 0,
    title: emptyTitle,
    summary: [
      `## ${emptyTitle}`,
      '',
      'No `.omc/deliverables.json` was found for this commit. ' +
        'Skipping the vibecodekit release gate — this is expected for repos ' +
        'that have not run `vibecodekit-hybrid-verify` yet.',
    ].join('\n'),
    gate: null,
    decision: null,
    slug: null,
    counts: { pass: 0, fail: 0, painful: 0, missing: 0 },
    rri: { t: null, ux: null, ui: null, sec: null },
  };

  if (!parsed || typeof parsed !== 'object') return empty;

  const gate = normGate(parsed.verify_gate);
  const decision = normDecision(parsed.release_decision);
  if (!gate && !decision) return empty;

  const vc = parsed.verdict_counts && typeof parsed.verdict_counts === 'object' ? parsed.verdict_counts : {};
  const counts = {
    pass: safeNumber(vc.pass),
    fail: safeNumber(vc.fail),
    painful: safeNumber(vc.painful),
    missing: safeNumber(vc.missing),
  };

  const slug = typeof parsed.slug === 'string' && parsed.slug.trim() ? parsed.slug.trim() : null;
  const rri = {
    t: normGate(parsed.rri_t_gate),
    ux: normGate(parsed.rri_ux_gate),
    ui: normGate(parsed.rri_ui_gate),
    sec: normGate(parsed.rri_sec_gate),
  };

  const inferredGate =
    gate ||
    (decision === 'SHIP'
      ? '🟢'
      : decision === 'SHIP_WITH_FOLLOWUPS'
        ? '🟡'
        : decision === 'DO_NOT_SHIP'
          ? '🔴'
          : null);

  let conclusion = 'neutral';
  let exitCode = 0;
  if (inferredGate === '🟢') {
    conclusion = 'success';
    exitCode = 0;
  } else if (inferredGate === '🟡') {
    conclusion = strict ? 'failure' : 'neutral';
    exitCode = strict ? 1 : 0;
  } else if (inferredGate === '🔴') {
    conclusion = 'failure';
    exitCode = 1;
  }

  const label =
    decision ||
    (inferredGate === '🟢' ? 'SHIP' : inferredGate === '🟡' ? 'SHIP_WITH_FOLLOWUPS' : inferredGate === '🔴' ? 'DO_NOT_SHIP' : 'UNKNOWN');

  const title = `Vibecodekit Gate — ${inferredGate ?? '⚫'} ${label}${slug ? ` (${slug})` : ''}`;

  const rriRow = (name, g) => (g ? `| ${name} | ${g} |` : `| ${name} | _not run_ |`);
  const summary = [
    `## ${title}`,
    '',
    `**Release decision**: \`${label}\`  `,
    `**Gate glyph**: ${inferredGate ?? '_missing_'}  `,
    slug ? `**Slug**: \`${slug}\`` : '**Slug**: _not set_',
    '',
    '### Verdict counts',
    '',
    '| PASS | FAIL | PAINFUL | MISSING |',
    '|------|------|---------|---------|',
    `| ${counts.pass} | ${counts.fail} | ${counts.painful} | ${counts.missing} |`,
    '',
    '### Sub-gates (RRI)',
    '',
    '| Stage | Gate |',
    '|-------|------|',
    rriRow('RRI-T (adversarial QA)', rri.t),
    rriRow('RRI-UX (pre-design critique)', rri.ux),
    rriRow('RRI-UI (design pipeline)', rri.ui),
    rriRow('RRI-SEC (security audit)', rri.sec),
    '',
    '<sub>Generated by `scripts/vibecodekit-gate-check.mjs` — see `docs/VIBECODEKIT-HYBRID.md` for details.</sub>',
  ].join('\n');

  return {
    present: true,
    conclusion,
    exitCode,
    title,
    summary,
    gate: inferredGate,
    decision: decision || (inferredGate === '🟢' ? 'SHIP' : inferredGate === '🟡' ? 'SHIP_WITH_FOLLOWUPS' : inferredGate === '🔴' ? 'DO_NOT_SHIP' : null),
    slug,
    counts,
    rri,
  };
}

function resolveDeliverablesPath(args, env) {
  if (args.path) return args.path;
  if (env.VCK_DELIVERABLES_PATH) return env.VCK_DELIVERABLES_PATH;
  const cwd = args.cwd || env.GITHUB_WORKSPACE || process.cwd();
  return join(cwd, '.omc', 'deliverables.json');
}

function loadDeliverables(path) {
  if (!existsSync(path)) return { parsed: null, reason: 'not-found' };
  try {
    const raw = readFileSync(path, 'utf-8');
    return { parsed: JSON.parse(raw), reason: null };
  } catch (err) {
    return { parsed: null, reason: `unparseable: ${err instanceof Error ? err.message : String(err)}` };
  }
}

export function run(argv, env) {
  const args = parseArgs(argv);
  const strict = args.strict || env.VCK_STRICT === '1';
  const path = resolveDeliverablesPath(args, env);
  const { parsed, reason } = loadDeliverables(path);

  const decision = evaluateDeliverables(parsed, { strict });

  let summary = decision.summary;
  if (!decision.present && reason) {
    summary += `\n\n<sub>Path checked: \`${path}\` — reason: ${reason}</sub>`;
  }

  // Append to GitHub step summary when running in Actions
  if (env.GITHUB_STEP_SUMMARY) {
    try {
      appendFileSync(env.GITHUB_STEP_SUMMARY, summary + '\n');
    } catch {
      /* best-effort */
    }
  }

  // Also stream to stdout for local runs / log readability
  if (args.json) {
    process.stdout.write(JSON.stringify(decision) + '\n');
  } else {
    process.stdout.write(`${decision.title}\n`);
    if (decision.present) {
      process.stdout.write(
        `verdict_counts: pass=${decision.counts.pass} fail=${decision.counts.fail} painful=${decision.counts.painful} missing=${decision.counts.missing}\n`
      );
    } else {
      process.stdout.write(`(${reason || 'no gate present'})\n`);
    }
  }

  return decision.exitCode;
}

// Direct invocation
const invokedPath = process.argv[1] ? new URL(`file://${process.argv[1]}`).href : '';
if (import.meta.url === invokedPath) {
  const code = run(process.argv.slice(2), process.env);
  process.exit(code);
}
