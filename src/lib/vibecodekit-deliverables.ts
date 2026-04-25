import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { default as AjvDefault, type Ajv as AjvType } from 'ajv';

// Ajv ships as both a default export and a named class depending on the
// module interop layer. Normalise so esbuild + tsc + ts-node all behave.
const Ajv = (
  (AjvDefault as unknown as { default?: new (opts?: unknown) => AjvType })
    .default ?? AjvDefault
) as unknown as new (opts?: unknown) => AjvType;

/**
 * Validator for `.omc/deliverables.json` against the canonical JSON Schema
 * shipped at `templates/vibecodekit-hybrid/deliverables.schema.json`.
 *
 * Used by:
 * - `omc vibecodekit validate` (CLI subcommand)
 * - Future Phase 4a Check Run job to fail fast on schema drift
 */

export interface DeliverablesValidationError {
  /** JSON Pointer path within the document. Empty string for root. */
  path: string;
  /** Human-readable error description. */
  message: string;
}

export interface DeliverablesValidationResult {
  valid: boolean;
  errors: DeliverablesValidationError[];
  /** When the file was missing or unreadable. */
  fatal?: string;
}

let cachedValidator: ((data: unknown) => boolean) | null = null;
let cachedSchemaPath = '';

function resolveSchemaPath(): string {
  // Allow callers (tests, embedders) to override via env so they don't need
  // to ship the templates/ tree.
  const override = process.env['OMC_DELIVERABLES_SCHEMA'];
  if (override && existsSync(override)) return override;

  const here = fileURLToPath(import.meta.url);
  let dir = dirname(here);
  for (let i = 0; i < 8; i += 1) {
    const candidate = join(
      dir,
      'templates',
      'vibecodekit-hybrid',
      'deliverables.schema.json'
    );
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // Last resort — let Ajv throw a useful error pointing at the missing file.
  return join(
    process.cwd(),
    'templates',
    'vibecodekit-hybrid',
    'deliverables.schema.json'
  );
}

function getValidator(): (data: unknown) => boolean {
  const schemaPath = resolveSchemaPath();
  if (cachedValidator && cachedSchemaPath === schemaPath) {
    return cachedValidator;
  }
  const schema = JSON.parse(readFileSync(schemaPath, 'utf8')) as Record<
    string,
    unknown
  >;
  const ajv = new Ajv({ allErrors: true, strict: false });
  cachedValidator = ajv.compile(schema) as (data: unknown) => boolean;
  cachedSchemaPath = schemaPath;
  return cachedValidator;
}

/**
 * Validate a parsed deliverables.json object against the schema.
 * Use `validateDeliverablesFile` when working with an on-disk path.
 */
export function validateDeliverablesObject(
  data: unknown
): DeliverablesValidationResult {
  const validator = getValidator() as ((d: unknown) => boolean) & {
    errors?: { instancePath?: string; message?: string }[] | null;
  };
  const valid = validator(data);
  if (valid) return { valid: true, errors: [] };
  const errors: DeliverablesValidationError[] = (validator.errors ?? []).map(
    (e) => ({
      path: e.instancePath ?? '',
      message: e.message ?? 'unknown validation error',
    })
  );
  return { valid: false, errors };
}

/**
 * Validate `.omc/deliverables.json` at the given file path.
 * Returns a `fatal` field when the file is missing or not parseable.
 */
export function validateDeliverablesFile(
  filePath: string
): DeliverablesValidationResult {
  if (!existsSync(filePath)) {
    return {
      valid: false,
      errors: [],
      fatal: `deliverables.json not found at ${filePath}`,
    };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (err) {
    return {
      valid: false,
      errors: [],
      fatal: `failed to parse deliverables.json: ${
        err instanceof Error ? err.message : String(err)
      }`,
    };
  }
  return validateDeliverablesObject(parsed);
}
