import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { resolveVibecodekitLocale } from '../lib/vibecodekit-locale.js';
import { validateDeliverablesFile } from '../lib/vibecodekit-deliverables.js';
/**
 * `omc vibecodekit` — thin CLI surface for the vibecodekit-hybrid preset.
 *
 * The actual pipeline runs inside a Claude Code session via the skill
 * `vibecodekit-hybrid`. This CLI manages on-disk artifacts and release-gate
 * state so users can prep / inspect / summarize a run outside of Claude.
 *
 * Subcommands:
 *   omc vibecodekit help
 *   omc vibecodekit scaffold <slug> [--locale en|vi|ja]
 *   omc vibecodekit status  [<slug>]
 *   omc vibecodekit patterns
 *   omc vibecodekit locales
 */
export const VIBECODEKIT_HELP = `omc vibecodekit - Vibecodekit Hybrid preset artifact manager

Usage:
  omc vibecodekit help
  omc vibecodekit scaffold <slug> [--locale en|vi|ja]
  omc vibecodekit status [<slug>]
  omc vibecodekit validate [<path>]
  omc vibecodekit patterns
  omc vibecodekit locales

Subcommands:
  help        Show this help message.
  scaffold    Create .omc/ directories + blank artifact templates for <slug>.
              --locale vi mirrors Vietnamese overlays from locale/vi/ too,
              --locale ja mirrors Japanese overlays from locale/ja/.
  status      Read .omc/deliverables.json and print the current release gate.
              If <slug> is given, only that slug's gate is printed.
  validate    Validate .omc/deliverables.json (or the path you pass) against
              the canonical JSON Schema at templates/vibecodekit-hybrid/
              deliverables.schema.json. Exits 0 on pass, 1 on schema fail,
              2 on missing/unparseable file. Used by Phase 4a Check Run.
  patterns    List the 10 vision patterns available under templates/vibecodekit-hybrid/vision-patterns/.
  locales     List available locale overlays under locale/.

Notes:
  - The actual pipeline runs inside a Claude Code session via the skill
    /oh-my-claudecode:vibecodekit-hybrid. This CLI only manages on-disk state.
  - All artifact headings stay in English for tool parsing; only body text
    switches language under --locale vi or --locale ja.
`;
function findPluginRoot() {
    const envRoot = process.env['OMC_PLUGIN_ROOT'];
    if (envRoot && existsSync(join(envRoot, '.claude-plugin', 'plugin.json'))) {
        return envRoot;
    }
    const here = fileURLToPath(import.meta.url);
    let dir = dirname(here);
    for (let i = 0; i < 8; i += 1) {
        if (existsSync(join(dir, '.claude-plugin', 'plugin.json'))) {
            return dir;
        }
        const parent = dirname(dir);
        if (parent === dir)
            break;
        dir = parent;
    }
    return process.cwd();
}
function ensureDir(path) {
    if (!existsSync(path))
        mkdirSync(path, { recursive: true });
}
function slugify(input) {
    return input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 64);
}
function copyTemplate(srcFile, dstFile, slug, locale) {
    if (existsSync(dstFile)) {
        return { copied: false, reason: 'already exists' };
    }
    if (!existsSync(srcFile)) {
        return { copied: false, reason: 'template missing' };
    }
    let content = readFileSync(srcFile, 'utf8');
    // Templates under templates/vibecodekit-hybrid/ use mustache-style
    // placeholders ({{slug}}, {{locale}}, {{date}}). The earlier `<slug>`
    // regexes never matched, so scaffolded artifacts shipped with literal
    // `{{slug}}` strings in their headings.
    content = content
        .replace(/\{\{slug\}\}/g, slug)
        .replace(/\{\{locale\}\}/g, locale)
        .replace(/\{\{date\}\}/g, new Date().toISOString().slice(0, 10));
    ensureDir(dirname(dstFile));
    writeFileSync(dstFile, content, 'utf8');
    return { copied: true };
}
function parseScaffoldArgs(args) {
    let slugArg = '';
    let locale = 'en';
    let localeExplicit = false;
    for (let i = 0; i < args.length; i += 1) {
        const a = args[i];
        if (a === '--locale') {
            const v = args[i + 1];
            if (v === 'vi' || v === 'en' || v === 'ja') {
                locale = v;
                localeExplicit = true;
                i += 1;
            }
            else {
                throw new Error(`--locale must be 'en', 'vi', or 'ja' (got '${v ?? ''}')`);
            }
        }
        else if (a?.startsWith('--locale=')) {
            const v = a.slice('--locale='.length);
            if (v === 'vi' || v === 'en' || v === 'ja') {
                locale = v;
                localeExplicit = true;
            }
            else {
                throw new Error(`--locale must be 'en', 'vi', or 'ja' (got '${v}')`);
            }
        }
        else if (a && !a.startsWith('-') && !slugArg) {
            slugArg = a;
        }
    }
    // Only consult the env / project signals when the user did not pass an
    // explicit --locale flag. Use the same resolver as the HUD / status
    // command so POSIX-style values like 'vi_VN.UTF-8' normalize to 'vi'.
    if (!localeExplicit) {
        const resolution = resolveVibecodekitLocale(process.cwd(), process.env);
        if (resolution.signal !== 'default') {
            locale = resolution.locale;
        }
    }
    if (!slugArg) {
        throw new Error('scaffold requires <slug>, e.g. omc vibecodekit scaffold checkout-flow');
    }
    const slug = slugify(slugArg);
    if (!slug) {
        throw new Error(`slug '${slugArg}' contains no alphanumeric characters after normalization`);
    }
    return { slug, locale };
}
function scaffoldCommand(args) {
    let parsed;
    try {
        parsed = parseScaffoldArgs(args);
    }
    catch (err) {
        console.error(chalk.red(`Error: ${err instanceof Error ? err.message : String(err)}`));
        return 2;
    }
    const { slug, locale } = parsed;
    const pluginRoot = findPluginRoot();
    const templateRoot = join(pluginRoot, 'templates', 'vibecodekit-hybrid');
    const cwd = process.cwd();
    const layout = [
        {
            dir: '.omc/research',
            file: `vibecodekit-hybrid-scan-${slug}.md`,
            src: join(templateRoot, 'scan-report.md'),
        },
        {
            // RRI specs artifact has its own template (Requirements Matrix /
            // Decisions Log / Open Questions). It is NOT a TIP — TIPs are per-
            // task instruction packs written during BUILD. Pointing this slot
            // at tip.md leaks Task ID / Assigned worker placeholders into the
            // RRI artifact.
            dir: '.omc/specs',
            file: `vibecodekit-hybrid-rri-${slug}.md`,
            src: join(templateRoot, 'rri-report.md'),
        },
        {
            dir: '.omc/plans',
            file: `vibecodekit-hybrid-${slug}.md`,
            src: join(templateRoot, 'blueprint.md'),
        },
        {
            dir: '.omc/plans',
            file: `vibecodekit-hybrid-verify-${slug}.md`,
            src: join(templateRoot, 'verify-report.md'),
        },
        {
            dir: '.omc/research',
            file: `vibecodekit-hybrid-rri-ux-${slug}.md`,
            src: join(templateRoot, 'rri-ux-report.md'),
        },
        {
            dir: '.omc/verify',
            file: `vibecodekit-hybrid-rri-t-${slug}.md`,
            src: join(templateRoot, 'rri-t-report.md'),
        },
        {
            dir: '.omc/design',
            file: `vibecodekit-hybrid-rri-ui-${slug}.md`,
            src: join(templateRoot, 'rri-ui-report.md'),
        },
    ];
    const created = [];
    const skipped = [];
    for (const entry of layout) {
        const dstFile = resolve(cwd, entry.dir, entry.file);
        const result = copyTemplate(entry.src, dstFile, slug, locale);
        if (result.copied) {
            created.push(`${entry.dir}/${entry.file}`);
        }
        else {
            skipped.push({
                path: `${entry.dir}/${entry.file}`,
                reason: result.reason ?? 'unknown',
            });
        }
    }
    const deliverablesPath = resolve(cwd, '.omc/deliverables.json');
    if (!existsSync(deliverablesPath)) {
        ensureDir(dirname(deliverablesPath));
        const initial = {
            slug,
            locale,
            verify_gate: null,
            verdict_counts: { pass: 0, fail: 0, painful: 0, missing: 0 },
            release_decision: null,
            rri_t_gate: null,
            rri_ux_gate: null,
            rri_ui_gate: null,
            rri_sec_gate: null,
            artifact: `.omc/plans/vibecodekit-hybrid-verify-${slug}.md`,
            updated_at: new Date().toISOString(),
        };
        writeFileSync(deliverablesPath, `${JSON.stringify(initial, null, 2)}\n`, 'utf8');
        created.push('.omc/deliverables.json');
    }
    console.log(chalk.green(`Scaffolded vibecodekit-hybrid run: ${chalk.bold(slug)} (locale=${locale})`));
    if (created.length > 0) {
        console.log(chalk.cyan('Created:'));
        for (const path of created)
            console.log(`  + ${path}`);
    }
    if (skipped.length > 0) {
        console.log(chalk.yellow('Skipped:'));
        for (const s of skipped)
            console.log(`  · ${s.path} (${s.reason})`);
    }
    console.log('');
    console.log(chalk.gray('Next: open a Claude Code session and run'));
    console.log(chalk.bold(`  /oh-my-claudecode:vibecodekit-hybrid --locale ${locale} "${slug}"`));
    return 0;
}
function statusCommand(args) {
    const cwd = process.cwd();
    const deliverablesPath = resolve(cwd, '.omc/deliverables.json');
    if (!existsSync(deliverablesPath)) {
        console.error(chalk.yellow('No .omc/deliverables.json found. Run `omc vibecodekit scaffold <slug>` first.'));
        return 1;
    }
    let parsed;
    try {
        parsed = JSON.parse(readFileSync(deliverablesPath, 'utf8'));
    }
    catch (err) {
        console.error(chalk.red(`Failed to parse deliverables.json: ${err instanceof Error ? err.message : String(err)}`));
        return 1;
    }
    const wantSlug = args[0];
    const slug = String(parsed.slug ?? '');
    if (wantSlug && slug && slug !== wantSlug) {
        console.error(chalk.yellow(`deliverables.json slug is '${slug}', not '${wantSlug}'.`));
        return 1;
    }
    const gate = parsed.verify_gate ?? '—';
    const decision = parsed.release_decision ?? '—';
    const counts = parsed.verdict_counts ?? {
        pass: 0,
        fail: 0,
        painful: 0,
        missing: 0,
    };
    const resolution = resolveVibecodekitLocale(cwd);
    console.log(chalk.bold(`vibecodekit-hybrid status — ${slug || '(no slug)'}`));
    console.log(`  locale           : ${parsed.locale ?? 'en'}`);
    console.log(`  locale_signal    : ${resolution.signal} (resolved=${resolution.locale})`);
    console.log(`  verify_gate      : ${gate}`);
    console.log(`  release_decision : ${decision}`);
    console.log(`  verdict_counts   : pass=${counts.pass ?? 0} fail=${counts.fail ?? 0} painful=${counts.painful ?? 0} missing=${counts.missing ?? 0}`);
    console.log(`  rri_t_gate       : ${parsed.rri_t_gate ?? '—'}`);
    console.log(`  rri_ux_gate      : ${parsed.rri_ux_gate ?? '—'}`);
    console.log(`  rri_ui_gate      : ${parsed.rri_ui_gate ?? '—'}`);
    console.log(`  rri_sec_gate     : ${parsed.rri_sec_gate ?? '—'}`);
    const artifact = parsed.artifact;
    if (artifact)
        console.log(`  artifact         : ${artifact}`);
    const updatedAt = parsed.updated_at;
    if (updatedAt)
        console.log(`  updated_at       : ${updatedAt}`);
    return 0;
}
function validateCommand(args) {
    const cwd = process.cwd();
    const filePath = args[0]
        ? resolve(cwd, args[0])
        : resolve(cwd, '.omc/deliverables.json');
    const result = validateDeliverablesFile(filePath);
    if (result.fatal) {
        console.error(chalk.red(`Error: ${result.fatal}`));
        return 2;
    }
    if (result.valid) {
        console.log(chalk.green(`OK  ${filePath}`));
        console.log(`    matches templates/vibecodekit-hybrid/deliverables.schema.json`);
        return 0;
    }
    console.error(chalk.red(`FAIL  ${filePath}`));
    for (const err of result.errors) {
        const where = err.path || '<root>';
        console.error(`  ${where}: ${err.message}`);
    }
    console.error(chalk.yellow(`\nSchema lives at templates/vibecodekit-hybrid/deliverables.schema.json. ` +
        `Run \`omc vibecodekit scaffold <slug>\` to regenerate from a known-good template.`));
    return 1;
}
function patternsCommand() {
    const pluginRoot = findPluginRoot();
    const patternsDir = join(pluginRoot, 'templates', 'vibecodekit-hybrid', 'vision-patterns');
    if (!existsSync(patternsDir)) {
        console.error(chalk.red(`Pattern directory not found: ${patternsDir}`));
        return 1;
    }
    const entries = readdirSync(patternsDir)
        .filter((name) => name.endsWith('.md'))
        .sort();
    console.log(chalk.bold('Available vision patterns:'));
    for (const name of entries) {
        console.log(`  ${name.replace(/\.md$/, '')}`);
    }
    return 0;
}
function localesCommand() {
    const pluginRoot = findPluginRoot();
    const localeRoot = join(pluginRoot, 'locale');
    if (!existsSync(localeRoot)) {
        console.log(chalk.yellow('No locale/ directory found. Only English is available.'));
        return 0;
    }
    const entries = readdirSync(localeRoot, { withFileTypes: true });
    console.log(chalk.bold('Available locales:'));
    console.log('  en  (default, bundled in skills)');
    for (const e of entries) {
        if (e.isDirectory())
            console.log(`  ${e.name}  (overlay at locale/${e.name}/)`);
    }
    return 0;
}
export async function vibecodekitCommand(rawArgs) {
    const [sub, ...rest] = rawArgs;
    let exitCode = 0;
    switch (sub) {
        case undefined:
        case 'help':
        case '--help':
        case '-h':
            console.log(VIBECODEKIT_HELP);
            break;
        case 'scaffold':
            exitCode = scaffoldCommand(rest);
            break;
        case 'status':
            exitCode = statusCommand(rest);
            break;
        case 'validate':
            exitCode = validateCommand(rest);
            break;
        case 'patterns':
            exitCode = patternsCommand();
            break;
        case 'locales':
            exitCode = localesCommand();
            break;
        default:
            console.error(chalk.red(`Unknown subcommand: ${sub}`));
            console.error(VIBECODEKIT_HELP);
            exitCode = 2;
    }
    if (exitCode !== 0)
        process.exit(exitCode);
}
//# sourceMappingURL=vibecodekit.js.map