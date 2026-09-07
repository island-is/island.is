import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const subSectionRequirements = (
  allow65RenewalRedesign = false,
  allowBTempRedesign = false,
  allowBFullRedesign = false,
) =>
  buildSubSection({
    id: 'requirements',
    title: m.applicationEligibilityTitle,
    children: [
      buildMultiField({
        id: 'info',
        title: m.applicationEligibilityTitle,
        description: m.eligibilityRequirementTitle,
        children: [
          buildHiddenInput({
            id: 'is65RenewalRedesignEnabled',
            defaultValue: () => allow65RenewalRedesign,
          }),
          buildHiddenInput({
            id: 'isBTempRedesignEnabled',
            defaultValue: () => allowBTempRedesign,
          }),
          buildHiddenInput({
            id: 'isBFullRedesignEnabled',
            defaultValue: () => allowBFullRedesign,
          }),
          buildCustomField({
            title: m.eligibilityRequirementTitle,
            component: 'EligibilitySummary',
            id: 'eligsummary',
          }),
          // Gates the "keep going" (continue) button: EligibilitySummary sets
          // `requirementsMet`, and registering it on this screen makes the
          // resolver enforce dataSchema's `requirementsMet.refine((v) => v)`,
          // so the applicant can only continue once eligibility passes.
          buildHiddenInput({
            id: 'requirementsMet',
          }),
        ],
      }),
    ],
  })
