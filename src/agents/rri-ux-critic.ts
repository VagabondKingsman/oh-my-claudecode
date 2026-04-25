/**
 * RRI-UX Critic Agent - Flow Physics UX critique (Sonnet)
 *
 * Adversarial UX reviewer for the Vibecodekit Hybrid pipeline. Runs 5 UX
 * personas (Speed Runner / First-Timer / Data Scanner / Multi-Tasker / Field
 * Worker) across 7 UX dimensions and 8 Flow Physics axes, producing S→V→P→F→I
 * issues with a 4-level impact (FLOW / FRICTION / BROKEN / MISSING).
 */

import type { AgentConfig, AgentPromptMetadata } from './types.js';
import { loadAgentPrompt } from './utils.js';

export const RRI_UX_CRITIC_PROMPT_METADATA: AgentPromptMetadata = {
  category: 'specialist',
  cost: 'CHEAP',
  promptAlias: 'RRIUXCritic',
  triggers: [
    { domain: 'UX', trigger: 'Flow Physics critique (5 UX personas × 7 dimensions × 8 axes)' },
    { domain: 'Design', trigger: 'Pre-code UX review that catches anti-patterns before they ship' },
    { domain: 'Vibecodekit', trigger: 'RRI-UX stage of the vibecodekit-hybrid pipeline' },
  ],
  useWhen: [
    'A wireframe, mockup, staging build, or flow description needs UX review before code',
    'User invoked vibecodekit-hybrid-rri-ux or asked for flow physics / UX audit',
    'RRI-T flagged a cluster of PAINFUL items that need a UX root-cause diagnosis',
  ],
  avoidWhen: [
    'Project has no UI (backend / CLI) — use rri-tester for API ergonomics',
    'Architectural problem rather than UX — use architect / critic',
  ],
};

export const rriUxCriticAgent: AgentConfig = {
  name: 'rri-ux-critic',
  description:
    'RRI-UX specialist (Sonnet). Runs 5 UX personas × 7 UX dimensions × 8 Flow Physics axes, produces 80-120 S→V→P→F→I issues per module, scores a UX Coverage Matrix, and emits a release-gate decision with Vietnamese-specific checklist when OMC_LOCALE=vi.',
  prompt: loadAgentPrompt('rri-ux-critic'),
  model: 'sonnet',
  defaultModel: 'sonnet',
  metadata: RRI_UX_CRITIC_PROMPT_METADATA,
};
