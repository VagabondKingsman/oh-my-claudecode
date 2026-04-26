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
/**
 * Validate a parsed deliverables.json object against the schema.
 * Use `validateDeliverablesFile` when working with an on-disk path.
 */
export declare function validateDeliverablesObject(data: unknown): DeliverablesValidationResult;
/**
 * Validate `.omc/deliverables.json` at the given file path.
 * Returns a `fatal` field when the file is missing or not parseable.
 */
export declare function validateDeliverablesFile(filePath: string): DeliverablesValidationResult;
//# sourceMappingURL=vibecodekit-deliverables.d.ts.map