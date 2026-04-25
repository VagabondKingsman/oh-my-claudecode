import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  validateDeliverablesObject,
  validateDeliverablesFile,
} from '../lib/vibecodekit-deliverables.js';

function validDeliverables(overrides: Record<string, unknown> = {}) {
  return {
    slug: 'checkout-flow',
    locale: 'en' as const,
    pattern: 'saas' as const,
    verify_gate: '🟢',
    verdict_counts: { pass: 36, fail: 0, painful: 0, missing: 0 },
    release_decision: 'SHIP' as const,
    rri_t_gate: '🟢',
    rri_ux_gate: '🟢',
    rri_ui_gate: '🟢',
    artifact: '.omc/plans/vibecodekit-hybrid-verify-checkout-flow.md',
    updated_at: '2026-04-24T01:53:14.123Z',
    ...overrides,
  };
}

describe('vibecodekit-deliverables validator', () => {
  it('accepts a fully populated SHIP deliverables object', () => {
    const result = validateDeliverablesObject(validDeliverables());
    expect(result.valid, JSON.stringify(result.errors)).toBe(true);
  });

  it('accepts a freshly scaffolded shape (all gates null)', () => {
    const fresh = {
      slug: 'fresh-feature',
      locale: 'en',
      verify_gate: null,
      verdict_counts: { pass: 0, fail: 0, painful: 0, missing: 0 },
      release_decision: null,
      rri_t_gate: null,
      rri_ux_gate: null,
      rri_ui_gate: null,
      artifact: '.omc/plans/vibecodekit-hybrid-verify-fresh-feature.md',
      updated_at: '2026-04-24T00:00:00.000Z',
    };
    const result = validateDeliverablesObject(fresh);
    expect(result.valid, JSON.stringify(result.errors)).toBe(true);
  });

  it('rejects an unknown release_decision', () => {
    const result = validateDeliverablesObject(
      validDeliverables({ release_decision: 'PROBABLY_OK' }),
    );
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.path === '/release_decision'),
    ).toBe(true);
  });

  it('rejects a SHIP_WITH_FOLLOWUPS without a non-empty followups array', () => {
    const result = validateDeliverablesObject(
      validDeliverables({
        verify_gate: '🟡',
        release_decision: 'SHIP_WITH_FOLLOWUPS',
      }),
    );
    expect(result.valid).toBe(false);
    // The conditional schema attaches the error at the followups field or root.
    expect(
      result.errors.some(
        (e) => e.path === '' || e.path.startsWith('/followups'),
      ),
    ).toBe(true);
  });

  it('rejects a slug with invalid casing', () => {
    const result = validateDeliverablesObject(
      validDeliverables({ slug: 'Checkout_Flow' }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === '/slug')).toBe(true);
  });

  it('rejects an unknown locale', () => {
    const result = validateDeliverablesObject(
      validDeliverables({ locale: 'fr' }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === '/locale')).toBe(true);
  });

  it('rejects an unknown pattern', () => {
    const result = validateDeliverablesObject(
      validDeliverables({ pattern: 'metaverse' }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === '/pattern')).toBe(true);
  });

  it('rejects an artifact path outside .omc/', () => {
    const result = validateDeliverablesObject(
      validDeliverables({ artifact: 'reports/verify.md' }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === '/artifact')).toBe(true);
  });

  it('rejects a malformed updated_at timestamp', () => {
    const result = validateDeliverablesObject(
      validDeliverables({ updated_at: '2026/04/24 14:00' }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === '/updated_at')).toBe(true);
  });

  it('rejects unknown top-level fields (no schema drift)', () => {
    const result = validateDeliverablesObject(
      validDeliverables({ surprise_field: true }),
    );
    expect(result.valid).toBe(false);
    // Ajv reports additionalProperties violations against the parent path
    // ('' for root) with a message like "must NOT have additional properties".
    expect(
      result.errors.some((e) => /additional/i.test(e.message)),
    ).toBe(true);
  });

  it('rejects a follow-up missing required keys', () => {
    const result = validateDeliverablesObject({
      ...validDeliverables({
        verify_gate: '🟡',
        release_decision: 'SHIP_WITH_FOLLOWUPS',
      }),
      followups: [{ id: 'FU-001', from: 'rri-t', verdict: 'PAINFUL' }],
    });
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.path.startsWith('/followups/0')),
    ).toBe(true);
  });

  it('reports a fatal error when the file is missing', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'vk-validator-'));
    const result = validateDeliverablesFile(join(tmp, 'missing.json'));
    expect(result.valid).toBe(false);
    expect(result.fatal).toBeTruthy();
    expect(result.errors).toEqual([]);
  });

  it('reports a fatal error when the file is unparseable', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'vk-validator-'));
    const path = join(tmp, 'broken.json');
    writeFileSync(path, '{ this is not json', 'utf8');
    const result = validateDeliverablesFile(path);
    expect(result.valid).toBe(false);
    expect(result.fatal).toMatch(/parse/);
  });

  it('validates the SHIP_WITH_FOLLOWUPS landing-vn example', () => {
    const example = {
      slug: 'landing-vn',
      locale: 'vi' as const,
      pattern: 'landing' as const,
      verify_gate: '🟡',
      verdict_counts: { pass: 9, fail: 0, painful: 1, missing: 0 },
      release_decision: 'SHIP_WITH_FOLLOWUPS' as const,
      rri_t_gate: null,
      rri_ux_gate: '🟢',
      rri_ui_gate: null,
      artifact: '.omc/plans/vibecodekit-hybrid-verify-landing-vn.md',
      updated_at: '2026-04-24T00:00:00.000Z',
      followups: [
        {
          id: 'FU-001',
          from: 'verify' as const,
          verdict: 'PAINFUL' as const,
          summary: 'Mobile CTA overlaps virtual keyboard at 375 px',
          owner: 'designer' as const,
          follow_up_tip: '.omc/plans/tips/landing-vn-fu-001.md',
        },
      ],
    };
    const result = validateDeliverablesObject(example);
    expect(result.valid, JSON.stringify(result.errors)).toBe(true);
  });
});
