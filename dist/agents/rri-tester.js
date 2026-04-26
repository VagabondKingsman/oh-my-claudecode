/**
 * RRI-T Tester Agent - Reverse Requirements Interview for Testing (Sonnet)
 *
 * Adversarial QA specialist for the Vibecodekit Hybrid pipeline. Runs 5 testing
 * personas (End User / BA / QA Destroyer / DevOps / Security) across 7
 * dimensions and 8 stress axes, emitting a 4-level verdict (PASS / FAIL /
 * PAINFUL / MISSING) + Coverage Matrix + Release Gate.
 */
import { loadAgentPrompt } from './utils.js';
export const RRI_TESTER_PROMPT_METADATA = {
    category: 'specialist',
    cost: 'CHEAP',
    promptAlias: 'RRITester',
    triggers: [
        { domain: 'Testing', trigger: 'Adversarial QA walk (5 personas × 7 dimensions × 8 stress axes)' },
        { domain: 'Quality', trigger: '4-level verdict PASS / FAIL / PAINFUL / MISSING with release gate' },
        { domain: 'Vibecodekit', trigger: 'RRI-T stage of the vibecodekit-hybrid pipeline' },
    ],
    useWhen: [
        'Build is runnable and needs adversarial coverage before a release decision',
        'User invoked vibecodekit-hybrid-rri-t or asked for a stress test / adversarial QA',
        'Existing verifier / ultraqa passes but PAINFUL / MISSING verdicts are suspected',
    ],
    avoidWhen: [
        'Feature is still in RRI / VISION / BLUEPRINT — there is nothing to stress',
        'Only a functional spec-vs-build check is needed (use verifier / ultraqa)',
    ],
};
export const rriTesterAgent = {
    name: 'rri-tester',
    description: 'RRI-T specialist (Sonnet). Runs 5 testing personas × 7 dimensions × 8 stress axes, generates Q→A→R→P→T test cases, records a 4-level verdict (PASS / FAIL / PAINFUL / MISSING) per case, computes a Module × Dimension coverage matrix, and emits a release-gate decision for the vibecodekit-hybrid pipeline.',
    prompt: loadAgentPrompt('rri-tester'),
    model: 'sonnet',
    defaultModel: 'sonnet',
    metadata: RRI_TESTER_PROMPT_METADATA,
};
//# sourceMappingURL=rri-tester.js.map