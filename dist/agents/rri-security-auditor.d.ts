/**
 * RRI-SEC Security Auditor Agent — Reverse Requirements Interview for Security (Sonnet)
 *
 * Adversarial security-intake specialist for the Vibecodekit Hybrid pipeline.
 * Runs 5 security personas (Threat Modeler / AppSec / Red Teamer / Compliance
 * Auditor / Privacy Officer) across 8 attack axes (A1 AuthN, A2 AuthZ,
 * A3 Injection, A4 Supply chain, A5 Secret hygiene, A6 Data exfil,
 * A7 DoS/Abuse, A8 Side channel) and emits a 4-level verdict
 * (PASS / FAIL / PAINFUL / MISSING) + Coverage Matrix + Release Gate.
 *
 * Sits beside `rri-tester` and `rri-ux-critic` as the third sub-skill that
 * VERIFY aggregates into the release gate (`rri_sec_gate` in deliverables.json).
 */
import type { AgentConfig, AgentPromptMetadata } from './types.js';
export declare const RRI_SECURITY_AUDITOR_PROMPT_METADATA: AgentPromptMetadata;
export declare const rriSecurityAuditorAgent: AgentConfig;
//# sourceMappingURL=rri-security-auditor.d.ts.map