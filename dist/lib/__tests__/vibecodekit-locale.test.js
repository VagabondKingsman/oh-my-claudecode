import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { resolveVibecodekitLocale, getVibecodekitLocale, } from '../vibecodekit-locale.js';
describe('resolveVibecodekitLocale', () => {
    let workDir;
    beforeEach(() => {
        workDir = mkdtempSync(join(tmpdir(), 'vck-locale-'));
        mkdirSync(join(workDir, '.omc'), { recursive: true });
    });
    afterEach(() => {
        rmSync(workDir, { recursive: true, force: true });
    });
    it('falls back to default English when no signal is present', () => {
        const result = resolveVibecodekitLocale(workDir, {});
        expect(result.locale).toBe('en');
        expect(result.signal).toBe('default');
        expect(result.rawValue).toBeUndefined();
    });
    it('reads .omc/locale.json when present', () => {
        writeFileSync(join(workDir, '.omc/locale.json'), JSON.stringify({ locale: 'vi' }), 'utf-8');
        const result = resolveVibecodekitLocale(workDir, {});
        expect(result.locale).toBe('vi');
        expect(result.signal).toBe('omc-locale-json');
        expect(result.rawValue).toBe('vi');
    });
    it('prefers .omc/locale.json over OMC_LOCALE env', () => {
        writeFileSync(join(workDir, '.omc/locale.json'), JSON.stringify({ locale: 'vi' }), 'utf-8');
        const result = resolveVibecodekitLocale(workDir, { OMC_LOCALE: 'en' });
        expect(result.locale).toBe('vi');
        expect(result.signal).toBe('omc-locale-json');
    });
    it('reads OMC_LOCALE env when locale.json is missing', () => {
        const result = resolveVibecodekitLocale(workDir, { OMC_LOCALE: 'vi' });
        expect(result.locale).toBe('vi');
        expect(result.signal).toBe('env:OMC_LOCALE');
        expect(result.rawValue).toBe('vi');
    });
    it('normalises POSIX-style locales (e.g. vi_VN.UTF-8 → vi)', () => {
        const result = resolveVibecodekitLocale(workDir, {
            OMC_LOCALE: 'vi_VN.UTF-8',
        });
        expect(result.locale).toBe('vi');
        expect(result.signal).toBe('env:OMC_LOCALE');
    });
    it('rejects unsupported locales and falls through to the next signal', () => {
        const result = resolveVibecodekitLocale(workDir, { OMC_LOCALE: 'fr' });
        expect(result.locale).toBe('en');
        expect(result.signal).toBe('default');
    });
    it('handles malformed locale.json gracefully', () => {
        writeFileSync(join(workDir, '.omc/locale.json'), '{ not valid json', 'utf-8');
        const result = resolveVibecodekitLocale(workDir, { OMC_LOCALE: 'vi' });
        expect(result.locale).toBe('vi');
        expect(result.signal).toBe('env:OMC_LOCALE');
    });
    it('handles locale.json with wrong-typed locale field', () => {
        writeFileSync(join(workDir, '.omc/locale.json'), JSON.stringify({ locale: 42 }), 'utf-8');
        const result = resolveVibecodekitLocale(workDir, {});
        expect(result.locale).toBe('en');
        expect(result.signal).toBe('default');
    });
    it('getVibecodekitLocale returns just the locale code', () => {
        writeFileSync(join(workDir, '.omc/locale.json'), JSON.stringify({ locale: 'vi' }), 'utf-8');
        expect(getVibecodekitLocale(workDir, {})).toBe('vi');
    });
    it('accepts ja from OMC_LOCALE env (Phase 4e)', () => {
        const result = resolveVibecodekitLocale(workDir, { OMC_LOCALE: 'ja' });
        expect(result.locale).toBe('ja');
        expect(result.signal).toBe('env:OMC_LOCALE');
        expect(result.rawValue).toBe('ja');
    });
    it('accepts ja from .omc/locale.json (Phase 4e)', () => {
        writeFileSync(join(workDir, '.omc/locale.json'), JSON.stringify({ locale: 'ja' }), 'utf-8');
        const result = resolveVibecodekitLocale(workDir, {});
        expect(result.locale).toBe('ja');
        expect(result.signal).toBe('omc-locale-json');
    });
    it('normalises POSIX-style ja_JP.UTF-8 → ja (Phase 4e)', () => {
        const result = resolveVibecodekitLocale(workDir, {
            OMC_LOCALE: 'ja_JP.UTF-8',
        });
        expect(result.locale).toBe('ja');
        expect(result.signal).toBe('env:OMC_LOCALE');
    });
});
//# sourceMappingURL=vibecodekit-locale.test.js.map