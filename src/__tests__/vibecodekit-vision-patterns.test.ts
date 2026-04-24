import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const PATTERNS_DIR = join(process.cwd(), 'templates', 'vibecodekit-hybrid', 'vision-patterns');

/**
 * Phase 4b — contract tests for the 3 new vision patterns. Every pattern
 * file must expose the same section spine as the existing 7, so `ralplan`
 * and the VISION skill can template against them identically.
 */
const REQUIRED_SECTIONS = [
  '## Structural signature',
  '## Canonical layout',
  '## Default tech stack',
  '## Non-goals',
  '## Persona focus (RRI)',
  '## Flow Physics (RRI-UX) priorities',
  '## Acceptance skeleton',
];

describe('vibecodekit vision patterns (Phase 4b)', () => {
  for (const name of ['mobile-app', 'cli-tool', 'data-pipeline']) {
    describe(`${name}.md`, () => {
      const content = readFileSync(join(PATTERNS_DIR, `${name}.md`), 'utf-8');

      it('starts with a pattern heading', () => {
        expect(content).toMatch(/^# Vision Pattern — /m);
      });

      it.each(REQUIRED_SECTIONS)('contains section: %s', (section) => {
        expect(content).toContain(section);
      });

      it('includes an acceptance-skeleton fenced block', () => {
        expect(content).toMatch(/## Acceptance skeleton\s*```[\s\S]+?```/);
      });
    });
  }

  it('mobile-app mentions offline tolerance explicitly', () => {
    const content = readFileSync(join(PATTERNS_DIR, 'mobile-app.md'), 'utf-8');
    expect(content.toLowerCase()).toContain('offline');
    expect(content).toMatch(/React Native|Flutter/);
  });

  it('cli-tool mentions exit codes and JSON output', () => {
    const content = readFileSync(join(PATTERNS_DIR, 'cli-tool.md'), 'utf-8');
    expect(content.toLowerCase()).toContain('exit code');
    expect(content).toMatch(/--json|stdout/);
  });

  it('data-pipeline mentions idempotency and dead-letter handling', () => {
    const content = readFileSync(join(PATTERNS_DIR, 'data-pipeline.md'), 'utf-8');
    expect(content.toLowerCase()).toContain('idempoten');
    expect(content.toLowerCase()).toContain('dead-letter');
  });
});
