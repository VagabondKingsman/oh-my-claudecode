/**
 * RRI Interviewer Agent - Reverse Requirements Interview (Sonnet)
 *
 * 5-persona × 3-mode requirements interview agent for the Vibecodekit Hybrid
 * pipeline. Propose-first (never open-ended). Consumes a SCAN report so the
 * interview skips auto-answered questions and produces a Requirements Matrix
 * + Decisions Log + Open Questions artifact.
 */
import type { AgentConfig, AgentPromptMetadata } from './types.js';
export declare const RRI_INTERVIEWER_PROMPT_METADATA: AgentPromptMetadata;
export declare const rriInterviewerAgent: AgentConfig;
//# sourceMappingURL=rri-interviewer.d.ts.map