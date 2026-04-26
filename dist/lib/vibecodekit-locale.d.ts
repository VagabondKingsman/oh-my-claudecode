/**
 * Vibecodekit Hybrid — Locale Resolver
 *
 * Runtime-side counterpart of the SCAN-stage signal ladder documented in
 * `skills/vibecodekit-hybrid-scan/SKILL.md` step 5.
 *
 * At runtime (HUD, CLI, hooks) the ladder is narrower than at SCAN time —
 * we only consult deterministic, already-on-disk signals:
 *
 *   1. `.omc/locale.json` explicit override    (signal: "omc-locale-json")
 *   2. `OMC_LOCALE` environment variable       (signal: "env:OMC_LOCALE")
 *   3. Fallback                                (signal: "default")
 *
 * The README / manifest heuristics live in the SCAN skill because the agent
 * is the correct actor to apply them — the HUD must stay fast (sub-10 ms)
 * and must not do filesystem heuristics per render. When SCAN detects a
 * non-default locale it writes it into `.omc/locale.json`, which is then
 * picked up by this resolver deterministically.
 */
export type VibecodekitLocale = 'en' | 'vi' | 'ja';
export type VibecodekitLocaleSignal = 'omc-locale-json' | 'env:OMC_LOCALE' | 'default';
export interface VibecodekitLocaleResolution {
    locale: VibecodekitLocale;
    signal: VibecodekitLocaleSignal;
    /**
     * Raw value observed from the winning signal, for audit / debugging.
     * Never includes the default fallback.
     */
    rawValue?: string;
}
/**
 * Resolve the current vibecodekit locale using the deterministic signal ladder.
 *
 * @param directory - Working directory. Defaults to `process.cwd()`.
 * @param env       - Process env map. Defaults to `process.env`. Injected for testability.
 */
export declare function resolveVibecodekitLocale(directory?: string, env?: NodeJS.ProcessEnv): VibecodekitLocaleResolution;
/**
 * Convenience wrapper returning just the locale code.
 * Use when the caller doesn't need the resolution metadata.
 */
export declare function getVibecodekitLocale(directory?: string, env?: NodeJS.ProcessEnv): VibecodekitLocale;
//# sourceMappingURL=vibecodekit-locale.d.ts.map