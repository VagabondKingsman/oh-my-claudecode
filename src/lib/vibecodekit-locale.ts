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

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getOmcRoot } from './worktree-paths.js';

export type VibecodekitLocale = 'en' | 'vi' | 'ja';

export type VibecodekitLocaleSignal =
  | 'omc-locale-json'
  | 'env:OMC_LOCALE'
  | 'default';

export interface VibecodekitLocaleResolution {
  locale: VibecodekitLocale;
  signal: VibecodekitLocaleSignal;
  /**
   * Raw value observed from the winning signal, for audit / debugging.
   * Never includes the default fallback.
   */
  rawValue?: string;
}

/** Supported locales. Extend when more overlays ship (`locale/<code>/`). */
const SUPPORTED_LOCALES: readonly VibecodekitLocale[] = ['en', 'vi', 'ja'] as const;

function normaliseLocale(raw: string | undefined | null): VibecodekitLocale | null {
  if (!raw) return null;
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return null;
  // Strip e.g. `vi_VN.UTF-8` → `vi`, `en-US` → `en`
  const head = trimmed.split(/[_.-]/)[0];
  return (SUPPORTED_LOCALES as readonly string[]).includes(head)
    ? (head as VibecodekitLocale)
    : null;
}

function readLocaleJson(directory: string): { value: string; raw: string } | null {
  try {
    const omcRoot = getOmcRoot(directory);
    const localeFile = join(omcRoot, 'locale.json');
    if (!existsSync(localeFile)) return null;
    const raw = readFileSync(localeFile, 'utf-8');
    const parsed = JSON.parse(raw) as { locale?: unknown };
    if (typeof parsed.locale !== 'string') return null;
    return { value: parsed.locale, raw };
  } catch {
    return null;
  }
}

/**
 * Resolve the current vibecodekit locale using the deterministic signal ladder.
 *
 * @param directory - Working directory. Defaults to `process.cwd()`.
 * @param env       - Process env map. Defaults to `process.env`. Injected for testability.
 */
export function resolveVibecodekitLocale(
  directory: string = process.cwd(),
  env: NodeJS.ProcessEnv = process.env,
): VibecodekitLocaleResolution {
  // Signal 1: explicit override via `.omc/locale.json`.
  const fromFile = readLocaleJson(directory);
  if (fromFile) {
    const normalised = normaliseLocale(fromFile.value);
    if (normalised) {
      return {
        locale: normalised,
        signal: 'omc-locale-json',
        rawValue: fromFile.value,
      };
    }
  }

  // Signal 2: env var.
  const envValue = env.OMC_LOCALE;
  const fromEnv = normaliseLocale(envValue);
  if (fromEnv) {
    return {
      locale: fromEnv,
      signal: 'env:OMC_LOCALE',
      rawValue: envValue ?? undefined,
    };
  }

  // Signal 3: fallback.
  return { locale: 'en', signal: 'default' };
}

/**
 * Convenience wrapper returning just the locale code.
 * Use when the caller doesn't need the resolution metadata.
 */
export function getVibecodekitLocale(
  directory?: string,
  env?: NodeJS.ProcessEnv,
): VibecodekitLocale {
  return resolveVibecodekitLocale(directory, env).locale;
}
