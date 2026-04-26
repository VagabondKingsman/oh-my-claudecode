import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { readVibecodekitGateForHud } from '../omc-state.js';
import { renderVibecodekitGate, renderVibecodekitGateCompact, } from '../elements/vibecodekit-gate.js';
describe('readVibecodekitGateForHud', () => {
    let workDir;
    beforeEach(() => {
        workDir = mkdtempSync(join(tmpdir(), 'vck-gate-'));
        mkdirSync(join(workDir, '.omc'), { recursive: true });
    });
    afterEach(() => {
        rmSync(workDir, { recursive: true, force: true });
    });
    it('returns null when .omc/deliverables.json does not exist', () => {
        expect(readVibecodekitGateForHud(workDir)).toBeNull();
    });
    it('returns null when file is malformed JSON', () => {
        writeFileSync(join(workDir, '.omc/deliverables.json'), '{ bad', 'utf-8');
        expect(readVibecodekitGateForHud(workDir)).toBeNull();
    });
    it('returns null when neither verify_gate nor release_decision is set', () => {
        writeFileSync(join(workDir, '.omc/deliverables.json'), JSON.stringify({ slug: 'x', locale: 'en' }), 'utf-8');
        expect(readVibecodekitGateForHud(workDir)).toBeNull();
    });
    it('parses a SHIP gate', () => {
        writeFileSync(join(workDir, '.omc/deliverables.json'), JSON.stringify({
            slug: 'saas-v1',
            verify_gate: '🟢',
            release_decision: 'SHIP',
            verdict_counts: { pass: 36, fail: 0, painful: 2, missing: 0 },
            rri_t_gate: '🟢',
            rri_ux_gate: '🟢',
            rri_ui_gate: '🟢',
            locale: 'en',
        }), 'utf-8');
        const gate = readVibecodekitGateForHud(workDir);
        expect(gate).not.toBeNull();
        expect(gate.slug).toBe('saas-v1');
        expect(gate.verifyGate).toBe('🟢');
        expect(gate.releaseDecision).toBe('SHIP');
        expect(gate.verdictCounts).toEqual({ pass: 36, fail: 0, painful: 2, missing: 0 });
        expect(gate.rriTGate).toBe('🟢');
    });
    it('parses a SHIP_WITH_FOLLOWUPS gate', () => {
        writeFileSync(join(workDir, '.omc/deliverables.json'), JSON.stringify({
            slug: 'landing-vn',
            verify_gate: '🟡',
            release_decision: 'SHIP_WITH_FOLLOWUPS',
            verdict_counts: { pass: 20, fail: 0, painful: 1, missing: 0 },
        }), 'utf-8');
        const gate = readVibecodekitGateForHud(workDir);
        expect(gate.verifyGate).toBe('🟡');
        expect(gate.releaseDecision).toBe('SHIP_WITH_FOLLOWUPS');
        expect(gate.verdictCounts.painful).toBe(1);
        expect(gate.rriTGate).toBeNull();
    });
    it('rejects unknown gate glyphs but keeps valid release_decision', () => {
        writeFileSync(join(workDir, '.omc/deliverables.json'), JSON.stringify({
            slug: 'bad-gate',
            verify_gate: 'X',
            release_decision: 'SHIP',
        }), 'utf-8');
        const gate = readVibecodekitGateForHud(workDir);
        expect(gate.verifyGate).toBeNull();
        expect(gate.releaseDecision).toBe('SHIP');
    });
    it('coerces negative / non-finite verdict counts to zero', () => {
        writeFileSync(join(workDir, '.omc/deliverables.json'), JSON.stringify({
            slug: 'zero-out',
            verify_gate: '🟢',
            release_decision: 'SHIP',
            verdict_counts: { pass: -5, fail: Infinity, painful: 'NaN', missing: null },
        }), 'utf-8');
        const gate = readVibecodekitGateForHud(workDir);
        expect(gate.verdictCounts).toEqual({ pass: 0, fail: 0, painful: 0, missing: 0 });
    });
});
describe('renderVibecodekitGate', () => {
    it('returns null when gate is null', () => {
        expect(renderVibecodekitGate(null)).toBeNull();
    });
    const makeGate = (overrides = {}) => ({
        slug: 'demo',
        verifyGate: '🟢',
        releaseDecision: 'SHIP',
        verdictCounts: { pass: 30, fail: 0, painful: 0, missing: 0 },
        rriTGate: null,
        rriUxGate: null,
        rriUiGate: null,
        rriSecGate: null,
        ...overrides,
    });
    it('renders SHIP with pass count', () => {
        const out = renderVibecodekitGate(makeGate());
        expect(out).toContain('🟢');
        expect(out).toContain('VK:SHIP');
        expect(out).toContain('30P');
    });
    it('renders FOLLOWUPS with painful count when painful > 0 and fail = 0', () => {
        const out = renderVibecodekitGate(makeGate({
            verifyGate: '🟡',
            releaseDecision: 'SHIP_WITH_FOLLOWUPS',
            verdictCounts: { pass: 20, fail: 0, painful: 2, missing: 0 },
        }));
        expect(out).toContain('🟡');
        expect(out).toContain('VK:FOLLOWUPS');
        expect(out).toContain('2⚠');
    });
    it('renders DO_NOT_SHIP with fail count when fail > 0', () => {
        const out = renderVibecodekitGate(makeGate({
            verifyGate: '🔴',
            releaseDecision: 'DO_NOT_SHIP',
            verdictCounts: { pass: 5, fail: 3, painful: 2, missing: 1 },
        }));
        expect(out).toContain('🔴');
        expect(out).toContain('VK:DO_NOT_SHIP');
        expect(out).toContain('3❌');
    });
    it('derives label from glyph when release_decision is missing', () => {
        const out = renderVibecodekitGate(makeGate({ verifyGate: '🟡', releaseDecision: null }));
        expect(out).toContain('VK:FOLLOWUPS');
    });
});
describe('renderVibecodekitGateCompact', () => {
    it('returns null when gate is null', () => {
        expect(renderVibecodekitGateCompact(null)).toBeNull();
    });
    it('renders glyph-only form when glyph is set', () => {
        const out = renderVibecodekitGateCompact({
            slug: null,
            verifyGate: '🟢',
            releaseDecision: null,
            verdictCounts: { pass: 0, fail: 0, painful: 0, missing: 0 },
            rriTGate: null,
            rriUxGate: null,
            rriUiGate: null,
            rriSecGate: null,
        });
        expect(out).toBe('VK:🟢');
    });
    it('derives glyph from release_decision when glyph is missing', () => {
        const out = renderVibecodekitGateCompact({
            slug: null,
            verifyGate: null,
            releaseDecision: 'DO_NOT_SHIP',
            verdictCounts: { pass: 0, fail: 0, painful: 0, missing: 0 },
            rriTGate: null,
            rriUxGate: null,
            rriUiGate: null,
            rriSecGate: null,
        });
        expect(out).toBe('VK:🔴');
    });
});
//# sourceMappingURL=vibecodekit-gate.test.js.map