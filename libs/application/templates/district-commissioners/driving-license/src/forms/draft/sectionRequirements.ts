import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DrivingLicenseApplicationFor } from '../../utils/constants'

// `fixedApplicationFor` is passed when the license-selection screen is hidden
// (ALLOW_LICENSE_SELECTION off), so no radio writes `applicationFor`. We freeze
// it here instead so the required field is populated. When selection is on this
// is undefined and the radio in sectionApplicationFor owns the value.
export const sectionRequirements = (
  fixedApplicationFor?: DrivingLicenseApplicationFor,
) =>
  buildSection({
    id: 'requirements',
    title: m.applicationEligibilityTitle,
    children: [
      buildMultiField({
        id: 'info',
        title: m.applicationEligibilityTitle,
        description: m.eligibilityRequirementTitle,
        children: [
          ...(fixedApplicationFor
            ? [
                buildHiddenInput({
                  id: 'applicationFor',
                  defaultValue: fixedApplicationFor,
                }),
              ]
            : []),
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
