/**
 * OMC HUD - Vibecodekit Hybrid Release Gate Element
 *
 * Renders the release-gate state written by `vibecodekit-hybrid-verify`
 * into `.omc/deliverables.json`. Opt-in (disabled by default); when
 * enabled it surfaces the single verdict that matters most to the user
 * right now: can we ship?
 *
 *   🟢 VK:SHIP              — release_decision=SHIP, zero FAIL
 *   🟡 VK:FOLLOWUPS 34P 2⚠  — SHIP_WITH_FOLLOWUPS, shows PAINFUL count
 *   🔴 VK:DO_NOT_SHIP 1❌    — DO_NOT_SHIP, shows FAIL count
 *
 * The element deliberately stays short (< 30 chars) because it shares
 * the main HUD line with ralph / autopilot / prd.
 */
import type { VibecodekitGateForHud } from '../omc-state.js';
/**
 * Render the vibecodekit release gate.
 * Returns null when no gate has been emitted yet.
 */
export declare function renderVibecodekitGate(gate: VibecodekitGateForHud | null): string | null;
/**
 * Compact variant for minimal presets.
 *
 * Format: VK:🟢 / VK:🟡 / VK:🔴 / VK:? (unknown)
 */
export declare function renderVibecodekitGateCompact(gate: VibecodekitGateForHud | null): string | null;
//# sourceMappingURL=vibecodekit-gate.d.ts.map