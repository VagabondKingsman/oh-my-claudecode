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
import { RESET } from '../colors.js';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
function decisionLabel(gate) {
    if (gate.releaseDecision) {
        switch (gate.releaseDecision) {
            case 'SHIP':
                return 'SHIP';
            case 'SHIP_WITH_FOLLOWUPS':
                return 'FOLLOWUPS';
            case 'DO_NOT_SHIP':
                return 'DO_NOT_SHIP';
        }
    }
    // Fall back to glyph-only when decision is missing.
    switch (gate.verifyGate) {
        case '🟢':
            return 'SHIP';
        case '🟡':
            return 'FOLLOWUPS';
        case '🔴':
            return 'BLOCKED';
        default:
            return 'UNKNOWN';
    }
}
function decisionColor(gate) {
    const glyph = gate.verifyGate;
    if (glyph === '🟢')
        return GREEN;
    if (glyph === '🟡')
        return YELLOW;
    if (glyph === '🔴')
        return RED;
    // Fall back to release decision when glyph is missing.
    switch (gate.releaseDecision) {
        case 'SHIP':
            return GREEN;
        case 'SHIP_WITH_FOLLOWUPS':
            return YELLOW;
        case 'DO_NOT_SHIP':
            return RED;
        default:
            return DIM;
    }
}
/**
 * Render the vibecodekit release gate.
 * Returns null when no gate has been emitted yet.
 */
export function renderVibecodekitGate(gate) {
    if (!gate)
        return null;
    const glyph = gate.verifyGate ?? '';
    const label = decisionLabel(gate);
    const color = decisionColor(gate);
    const prefix = glyph ? `${glyph} ` : '';
    const parts = [`${prefix}${color}VK:${label}${RESET}`];
    const { pass, fail, painful } = gate.verdictCounts;
    if (fail > 0) {
        parts.push(`${RED}${fail}❌${RESET}`);
    }
    else if (painful > 0) {
        parts.push(`${YELLOW}${painful}⚠${RESET}`);
    }
    else if (pass > 0) {
        parts.push(`${DIM}${pass}P${RESET}`);
    }
    return parts.join(' ');
}
/**
 * Compact variant for minimal presets.
 *
 * Format: VK:🟢 / VK:🟡 / VK:🔴 / VK:? (unknown)
 */
export function renderVibecodekitGateCompact(gate) {
    if (!gate)
        return null;
    const glyph = gate.verifyGate;
    if (glyph)
        return `VK:${glyph}`;
    // Derive from release decision when glyph is missing.
    if (gate.releaseDecision === 'SHIP')
        return `VK:🟢`;
    if (gate.releaseDecision === 'SHIP_WITH_FOLLOWUPS')
        return `VK:🟡`;
    if (gate.releaseDecision === 'DO_NOT_SHIP')
        return `VK:🔴`;
    return `${DIM}VK:?${RESET}`;
}
//# sourceMappingURL=vibecodekit-gate.js.map