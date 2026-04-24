/**
 * RRI Interviewer Agent - Reverse Requirements Interview (Sonnet)
 *
 * 5-persona × 3-mode requirements interview agent for the Vibecodekit Hybrid
 * pipeline. Propose-first (never open-ended). Consumes a SCAN report so the
 * interview skips auto-answered questions and produces a Requirements Matrix
 * + Decisions Log + Open Questions artifact.
 */

import type { AgentConfig, AgentPromptMetadata } from './types.js';
import { loadAgentPrompt } from './utils.js';

export const RRI_INTERVIEWER_PROMPT_METADATA: AgentPromptMetadata = {
  category: 'specialist',
  cost: 'CHEAP',
  promptAlias: 'RRIInterviewer',
  triggers: [
    { domain: 'Requirements', trigger: 'Reverse Requirements Interview (5 personas × 3 modes)' },
    { domain: 'Discovery', trigger: 'Structured persona-driven project kickoff' },
    { domain: 'Vibecodekit', trigger: 'RRI stage of the vibecodekit-hybrid pipeline' },
  ],
  useWhen: [
    'Kickoff for a new or existing project that needs requirements before BUILD',
    'User invoked the vibecodekit-hybrid skill or the vibecodekit keyword',
    'A SCAN report exists and a 5-persona interview is the next stage',
  ],
  avoidWhen: [
    'User wants a generic Socratic interview (use deep-interview)',
    'No SCAN report exists yet (run vibecodekit-hybrid-scan first)',
    'Task is implementation — interview stage is complete',
  ],
};

export const rriInterviewerAgent: AgentConfig = {
  name: 'rri-interviewer',
  description:
    'Reverse Requirements Interview specialist (Sonnet). Runs a structured 5-persona × 3-mode interview, consumes the SCAN report to skip auto-answered questions, and produces a Requirements Matrix + Decisions Log + Open Questions artifact for the vibecodekit-hybrid pipeline.',
  prompt: loadAgentPrompt('rri-interviewer'),
  model: 'sonnet',
  defaultModel: 'sonnet',
  metadata: RRI_INTERVIEWER_PROMPT_METADATA,
};
