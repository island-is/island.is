import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const sectionRequirements = () =>
  buildSection({
    id: 'requirements',
    title: m.applicationEligibilityTitle,
    children: [
      buildMultiField({
        id: 'info',
        title: m.applicationEligibilityTitle,
        description: m.eligibilityRequirementTitle,
        children: [
          // Submission-contract constants: the shared driving-license submission
          // service branches on these frozen answers to pick the RLS endpoint.
          // This app only runs the current flow, so they are always true — see
          // driving-license-submission.service.ts.
          buildHiddenInput({
            id: 'is65RenewalRedesignEnabled',
            defaultValue: true,
          }),
          buildHiddenInput({
            id: 'isBTempRedesignEnabled',
            defaultValue: true,
          }),
          buildHiddenInput({
            id: 'isBFullRedesignEnabled',
            defaultValue: true,
          }),
          // Renders the requirement rows for the selected type from external data
          // and writes `requirementsMet`.
          buildCustomField({
            id: 'eligsummary',
            title: m.eligibilityRequirementTitle,
            component: 'EligibilitySummary',
          }),
          // Gates the "continue" button: `requirementsMet` is written by
          // EligibilitySummary, and registering it here makes the resolver
          // enforce dataSchema's `requirementsMet.refine((v) => v)`, so the
          // applicant can only continue once the selected type is eligible.
          buildHiddenInput({
            id: 'requirementsMet',
          }),
        ],
      }),
    ],
  })
