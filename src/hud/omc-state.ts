/**
 * OMC HUD - State Readers
 *
 * Read ralph, ultrawork, and PRD state from existing OMC files.
 * These are read-only functions that don't modify the state files.
 */

import { existsSync, readFileSync, statSync, readdirSync } from 'fs';
import { join } from 'path';
import { getOmcRoot } from '../lib/worktree-paths.js';
import type {
  RalphStateForHud,
  UltraworkStateForHud,
  PrdStateForHud,
} from './types.js';
import type { AutopilotStateForHud } from './elements/autopilot.js';

/**
 * Maximum age for state files to be considered "active".
 * Files older than this are treated as stale/abandoned.
 */
const MAX_STATE_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Check if a state file is stale based on file modification time.
 */
function isStateFileStale(filePath: string): boolean {
  try {
    const stat = statSync(filePath);
    const age = Date.now() - stat.mtimeMs;
    return age > MAX_STATE_AGE_MS;
  } catch {
    return true; // Treat errors as stale
  }
}

/**
 * Resolve state file path with fallback chain:
 * 1. Session-scoped paths (.omc/state/sessions/{id}/{filename}) - newest first
 * 2. Standard path (.omc/state/{filename})
 * 3. Legacy path (.omc/{filename})
 *
 * Returns the most recently modified matching path, or null if none found.
 * This ensures the HUD displays state from any active session (Issue #456).
 */
function resolveStatePath(directory: string, filename: string, sessionId?: string): string | null {
  const omcRoot = getOmcRoot(directory);

  if (sessionId) {
    const sessionPath = join(omcRoot, 'state', 'sessions', sessionId, filename);
    return existsSync(sessionPath) ? sessionPath : null;
  }

  let bestPath: string | null = null;
  let bestMtime = 0;

  // Check session-scoped paths first (most likely location after Issue #456 fix)
  const sessionsDir = join(omcRoot, 'state', 'sessions');
  if (existsSync(sessionsDir)) {
    try {
      const entries = readdirSync(sessionsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const sessionFile = join(sessionsDir, entry.name, filename);
        if (existsSync(sessionFile)) {
          try {
            const mtime = statSync(sessionFile).mtimeMs;
            if (mtime > bestMtime) {
              bestMtime = mtime;
              bestPath = sessionFile;
            }
          } catch {
            // Skip on stat error
          }
        }
      }
    } catch {
      // Ignore readdir errors
    }
  }

  // Check standard path
  const newPath = join(omcRoot, 'state', filename);
  if (existsSync(newPath)) {
    try {
      const mtime = statSync(newPath).mtimeMs;
      if (mtime > bestMtime) {
        bestMtime = mtime;
        bestPath = newPath;
      }
    } catch {
      if (!bestPath) bestPath = newPath;
    }
  }

  // Check legacy path
  const legacyPath = join(omcRoot, filename);
  if (existsSync(legacyPath)) {
    try {
      const mtime = statSync(legacyPath).mtimeMs;
      if (mtime > bestMtime) {
        bestPath = legacyPath;
      }
    } catch {
      if (!bestPath) bestPath = legacyPath;
    }
  }

  return bestPath;
}

// ============================================================================
// Ralph State
// ============================================================================

interface RalphLoopState {
  active: boolean;
  iteration: number;
  max_iterations: number;
  prd_mode?: boolean;
  current_story_id?: string;
}

/**
 * Read Ralph Loop state for HUD display.
 * Returns null if no state file exists or on error.
 */
export function readRalphStateForHud(directory: string, sessionId?: string): RalphStateForHud | null {
  const stateFile = resolveStatePath(directory, 'ralph-state.json', sessionId);

  if (!stateFile) {
    return null;
  }

  // Check for stale state file (abandoned session)
  if (isStateFileStale(stateFile)) {
    return null;
  }

  try {
    const content = readFileSync(stateFile, 'utf-8');
    const state = JSON.parse(content) as RalphLoopState;

    if (!state.active) {
      return null;
    }

    return {
      active: state.active,
      iteration: state.iteration,
      maxIterations: state.max_iterations,
      prdMode: state.prd_mode,
      currentStoryId: state.current_story_id,
    };
  } catch {
    return null;
  }
}

// ============================================================================
// Ultrawork State
// ============================================================================

interface UltraworkState {
  active: boolean;
  reinforcement_count: number;
}

/**
 * Read Ultrawork state for HUD display.
 * Checks only local .omc/state location.
 */
export function readUltraworkStateForHud(
  directory: string,
  sessionId?: string
): UltraworkStateForHud | null {
  // Check local state only (with new path fallback)
  const localFile = resolveStatePath(directory, 'ultrawork-state.json', sessionId);

  if (!localFile || isStateFileStale(localFile)) {
    return null;
  }

  try {
    const content = readFileSync(localFile, 'utf-8');
    const state = JSON.parse(content) as UltraworkState;

    if (!state.active) {
      return null;
    }

    return {
      active: state.active,
      reinforcementCount: state.reinforcement_count,
    };
  } catch {
    return null;
  }
}

// ============================================================================
// PRD State
// ============================================================================

interface UserStory {
  id: string;
  passes: boolean;
  priority: number;
}

interface PRD {
  userStories: UserStory[];
}

/**
 * Read PRD state for HUD display.
 * Checks both root prd.json and .omc/prd.json.
 */
export function readPrdStateForHud(directory: string): PrdStateForHud | null {
  // Check root first
  let prdPath = join(directory, 'prd.json');

  if (!existsSync(prdPath)) {
    // Check .omc
    prdPath = join(getOmcRoot(directory), 'prd.json');

    if (!existsSync(prdPath)) {
      return null;
    }
  }

  try {
    const content = readFileSync(prdPath, 'utf-8');
    const prd = JSON.parse(content) as PRD;

    if (!prd.userStories || !Array.isArray(prd.userStories)) {
      return null;
    }

    const stories = prd.userStories;
    const completed = stories.filter((s) => s.passes).length;
    const total = stories.length;

    // Find current story (first incomplete, sorted by priority)
    const incomplete = stories
      .filter((s) => !s.passes)
      .sort((a, b) => a.priority - b.priority);

    return {
      currentStoryId: incomplete[0]?.id || null,
      completed,
      total,
    };
  } catch {
    return null;
  }
}

// ============================================================================
// Autopilot State
// ============================================================================

interface AutopilotStateFile {
  active: boolean;
  phase?: string;
  current_phase?: string;
  iteration: number;
  max_iterations: number;
  execution?: {
    tasks_completed?: number;
    tasks_total?: number;
    files_created?: string[];
  };
}

/**
 * Read Autopilot state for HUD display.
 * Returns shape matching AutopilotStateForHud from elements/autopilot.ts.
 */
export function readAutopilotStateForHud(directory: string, sessionId?: string): AutopilotStateForHud | null {
  const stateFile = resolveStatePath(directory, 'autopilot-state.json', sessionId);

  if (!stateFile) {
    return null;
  }

  // Check for stale state file (abandoned session)
  if (isStateFileStale(stateFile)) {
    return null;
  }

  try {
    const content = readFileSync(stateFile, 'utf-8');
    const state = JSON.parse(content) as AutopilotStateFile;

    if (!state.active) {
      return null;
    }

    const phase = state.phase ?? state.current_phase;
    if (!phase) {
      return null;
    }

    return {
      active: state.active,
      phase,
      iteration: state.iteration,
      maxIterations: state.max_iterations,
      tasksCompleted: state.execution?.tasks_completed,
      tasksTotal: state.execution?.tasks_total,
      filesCreated: state.execution?.files_created?.length
    };
  } catch {
    return null;
  }
}

// ============================================================================
// Vibecodekit Hybrid Release Gate
// ============================================================================

interface VibecodekitDeliverablesFile {
  slug?: string;
  verify_gate?: string;
  verdict_counts?: {
    pass?: number;
    fail?: number;
    painful?: number;
    missing?: number;
  };
  release_decision?: string;
  rri_t_gate?: string | null;
  rri_ux_gate?: string | null;
  rri_ui_gate?: string | null;
  locale?: string;
}

/**
 * Canonical gate glyphs written by `vibecodekit-hybrid-verify`.
 * Anything else → treat as unknown.
 */
export type VibecodekitGateGlyph = '🟢' | '🟡' | '🔴';
export type VibecodekitReleaseDecision =
  | 'SHIP'
  | 'SHIP_WITH_FOLLOWUPS'
  | 'DO_NOT_SHIP';

export interface VibecodekitGateForHud {
  slug: string | null;
  verifyGate: VibecodekitGateGlyph | null;
  releaseDecision: VibecodekitReleaseDecision | null;
  verdictCounts: {
    pass: number;
    fail: number;
    painful: number;
    missing: number;
  };
  rriTGate: VibecodekitGateGlyph | null;
  rriUxGate: VibecodekitGateGlyph | null;
  rriUiGate: VibecodekitGateGlyph | null;
}

const GATE_GLYPHS: readonly VibecodekitGateGlyph[] = ['🟢', '🟡', '🔴'];
const RELEASE_DECISIONS: readonly VibecodekitReleaseDecision[] = [
  'SHIP',
  'SHIP_WITH_FOLLOWUPS',
  'DO_NOT_SHIP',
];

function normaliseGate(raw: unknown): VibecodekitGateGlyph | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  return (GATE_GLYPHS as readonly string[]).includes(trimmed)
    ? (trimmed as VibecodekitGateGlyph)
    : null;
}

function normaliseRelease(raw: unknown): VibecodekitReleaseDecision | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim().toUpperCase();
  return (RELEASE_DECISIONS as readonly string[]).includes(trimmed)
    ? (trimmed as VibecodekitReleaseDecision)
    : null;
}

function safeNumber(raw: unknown): number {
  return typeof raw === 'number' && Number.isFinite(raw) && raw >= 0
    ? Math.floor(raw)
    : 0;
}

/**
 * Read the vibecodekit release gate from `.omc/deliverables.json`.
 *
 * Returns null when the file is absent, unparseable, or when it contains
 * no usable gate signal. This matches the behaviour of the other HUD
 * state readers (ralph, autopilot, prd) — HUD code never throws.
 */
export function readVibecodekitGateForHud(directory: string): VibecodekitGateForHud | null {
  const omcRoot = getOmcRoot(directory);
  const deliverablesFile = join(omcRoot, 'deliverables.json');

  if (!existsSync(deliverablesFile)) {
    return null;
  }

  let parsed: VibecodekitDeliverablesFile;
  try {
    const content = readFileSync(deliverablesFile, 'utf-8');
    parsed = JSON.parse(content) as VibecodekitDeliverablesFile;
  } catch {
    return null;
  }

  const verifyGate = normaliseGate(parsed.verify_gate);
  const releaseDecision = normaliseRelease(parsed.release_decision);

  // Nothing meaningful to render — bail out.
  if (!verifyGate && !releaseDecision) {
    return null;
  }

  const vc = parsed.verdict_counts ?? {};

  return {
    slug: typeof parsed.slug === 'string' && parsed.slug.trim() ? parsed.slug.trim() : null,
    verifyGate,
    releaseDecision,
    verdictCounts: {
      pass: safeNumber(vc.pass),
      fail: safeNumber(vc.fail),
      painful: safeNumber(vc.painful),
      missing: safeNumber(vc.missing),
    },
    rriTGate: normaliseGate(parsed.rri_t_gate),
    rriUxGate: normaliseGate(parsed.rri_ux_gate),
    rriUiGate: normaliseGate(parsed.rri_ui_gate),
  };
}

// ============================================================================
// Combined State Check
// ============================================================================

/**
 * Check if any OMC mode is currently active
 */
export function isAnyModeActive(directory: string, sessionId?: string): boolean {
  const ralph = readRalphStateForHud(directory, sessionId);
  const ultrawork = readUltraworkStateForHud(directory, sessionId);
  const autopilot = readAutopilotStateForHud(directory, sessionId);

  return (ralph?.active ?? false) || (ultrawork?.active ?? false) || (autopilot?.active ?? false);
}

/**
 * Get active skill names for display
 */
export function getActiveSkills(directory: string, sessionId?: string): string[] {
  const skills: string[] = [];

  const autopilot = readAutopilotStateForHud(directory, sessionId);
  if (autopilot?.active) {
    skills.push('autopilot');
  }

  const ralph = readRalphStateForHud(directory, sessionId);
  if (ralph?.active) {
    skills.push('ralph');
  }

  const ultrawork = readUltraworkStateForHud(directory, sessionId);
  if (ultrawork?.active) {
    skills.push('ultrawork');
  }

  return skills;
}

// Re-export for convenience
export type { AutopilotStateForHud } from './elements/autopilot.js';
