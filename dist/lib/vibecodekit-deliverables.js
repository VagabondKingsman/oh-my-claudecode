import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { default as AjvDefault } from 'ajv';
// Ajv ships as both a default export and a named class depending on the
// module interop layer. Normalise so esbuild + tsc + ts-node all behave.
const Ajv = (AjvDefault
    .default ?? AjvDefault);
let cachedValidator = null;
let cachedSchemaPath = '';
function resolveSchemaPath() {
    // Allow callers (tests, embedders) to override via env so they don't need
    // to ship the templates/ tree.
    const override = process.env['OMC_DELIVERABLES_SCHEMA'];
    if (override && existsSync(override))
        return override;
    const here = fileURLToPath(import.meta.url);
    let dir = dirname(here);
    for (let i = 0; i < 8; i += 1) {
        const candidate = join(dir, 'templates', 'vibecodekit-hybrid', 'deliverables.schema.json');
        if (existsSync(candidate))
            return candidate;
        const parent = dirname(dir);
        if (parent === dir)
            break;
        dir = parent;
    }
    // Last resort — let Ajv throw a useful error pointing at the missing file.
    return join(process.cwd(), 'templates', 'vibecodekit-hybrid', 'deliverables.schema.json');
}
function getValidator() {
    const schemaPath = resolveSchemaPath();
    if (cachedValidator && cachedSchemaPath === schemaPath) {
        return cachedValidator;
    }
    const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
    const ajv = new Ajv({ allErrors: true, strict: false });
    cachedValidator = ajv.compile(schema);
    cachedSchemaPath = schemaPath;
    return cachedValidator;
}
/**
 * Validate a parsed deliverables.json object against the schema.
 * Use `validateDeliverablesFile` when working with an on-disk path.
 */
export function validateDeliverablesObject(data) {
    const validator = getValidator();
    const valid = validator(data);
    if (valid)
        return { valid: true, errors: [] };
    const errors = (validator.errors ?? []).map((e) => ({
        path: e.instancePath ?? '',
        message: e.message ?? 'unknown validation error',
    }));
    return { valid: false, errors };
}
/**
 * Validate `.omc/deliverables.json` at the given file path.
 * Returns a `fatal` field when the file is missing or not parseable.
 */
export function validateDeliverablesFile(filePath) {
    if (!existsSync(filePath)) {
        return {
            valid: false,
            errors: [],
            fatal: `deliverables.json not found at ${filePath}`,
        };
    }
    let parsed;
    try {
        parsed = JSON.parse(readFileSync(filePath, 'utf8'));
    }
    catch (err) {
        return {
            valid: false,
            errors: [],
            fatal: `failed to parse deliverables.json: ${err instanceof Error ? err.message : String(err)}`,
        };
    }
    return validateDeliverablesObject(parsed);
}
//# sourceMappingURL=vibecodekit-deliverables.js.map