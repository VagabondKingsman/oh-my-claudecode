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
import { loadAgentPrompt } from './utils.js';

export const RRI_SECURITY_AUDITOR_PROMPT_METADATA: AgentPromptMetadata = {
  category: 'specialist',
  cost: 'CHEAP',
  promptAlias: 'RRISecurityAuditor',
  triggers: [
    { domain: 'Security', trigger: 'Adversarial security walk (5 personas × 8 attack axes)' },
    { domain: 'Compliance', trigger: 'Threat-model + control-evidence coverage with 4-level verdict' },
    { domain: 'Vibecodekit', trigger: 'RRI-SEC stage of the vibecodekit-hybrid pipeline' },
  ],
  useWhen: [
    'Build handles authn/authz, payments, PII, uploads, or external integrations and needs structured threat coverage before release',
    'User invoked vibecodekit-hybrid-rri-sec or asked for "rri-sec", "security audit", "threat model"',
    'security-reviewer pass passes but MISSING / PAINFUL threats are suspected (no rate-limits, no audit trail, etc.)',
  ],
  avoidWhen: [
    'Feature is still in RRI / VISION / BLUEPRINT — there is nothing concrete to attack',
    'Only a static-analysis lint pass is needed (use security-reviewer or test-engineer instead)',
    'User asks for live exploitation against production — refuse and emit a ticket',
  ],
};

export const rriSecurityAuditorAgent: AgentConfig = {
  name: 'rri-security-auditor',
  description:
    'RRI-SEC specialist (Sonnet). Runs 5 security personas (Threat Modeler / AppSec / Red Teamer / Compliance Auditor / Privacy Officer) × 8 attack axes (A1 AuthN, A2 AuthZ, A3 Injection, A4 Supply chain, A5 Secret hygiene, A6 Data exfil, A7 DoS/Abuse, A8 Side channel), emits T→A→V→I→M threat cases with a 4-level verdict (PASS / FAIL / PAINFUL / MISSING) per case, computes a Module × Attack-axis coverage matrix, and emits a release-gate decision for the vibecodekit-hybrid pipeline.',
  prompt: loadAgentPrompt('rri-security-auditor'),
  model: 'sonnet',
  defaultModel: 'sonnet',
  metadata: RRI_SECURITY_AUDITOR_PROMPT_METADATA,
};
