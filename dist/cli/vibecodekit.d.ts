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
export declare const VIBECODEKIT_HELP = "omc vibecodekit - Vibecodekit Hybrid preset artifact manager\n\nUsage:\n  omc vibecodekit help\n  omc vibecodekit scaffold <slug> [--locale en|vi|ja]\n  omc vibecodekit status [<slug>]\n  omc vibecodekit validate [<path>]\n  omc vibecodekit patterns\n  omc vibecodekit locales\n\nSubcommands:\n  help        Show this help message.\n  scaffold    Create .omc/ directories + blank artifact templates for <slug>.\n              --locale vi mirrors Vietnamese overlays from locale/vi/ too,\n              --locale ja mirrors Japanese overlays from locale/ja/.\n  status      Read .omc/deliverables.json and print the current release gate.\n              If <slug> is given, only that slug's gate is printed.\n  validate    Validate .omc/deliverables.json (or the path you pass) against\n              the canonical JSON Schema at templates/vibecodekit-hybrid/\n              deliverables.schema.json. Exits 0 on pass, 1 on schema fail,\n              2 on missing/unparseable file. Used by Phase 4a Check Run.\n  patterns    List the 10 vision patterns available under templates/vibecodekit-hybrid/vision-patterns/.\n  locales     List available locale overlays under locale/.\n\nNotes:\n  - The actual pipeline runs inside a Claude Code session via the skill\n    /oh-my-claudecode:vibecodekit-hybrid. This CLI only manages on-disk state.\n  - All artifact headings stay in English for tool parsing; only body text\n    switches language under --locale vi or --locale ja.\n";
export declare function vibecodekitCommand(rawArgs: readonly string[]): Promise<void>;
//# sourceMappingURL=vibecodekit.d.ts.map