import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { DrivingLicenseFakeData } from '../../utils/constants'
import { structuralCandidates } from '../../utils'

// `freezeApplicationFor` is true when the license-selection screen is hidden
// (ALLOW_LICENSE_SELECTION off), so no radio writes `applicationFor`. We freeze
// it to the single structural candidate for this applicant — holds-no-B → B-temp,
// holds-temp-B → B-full, full-B & 65+ → renewal-65 (they are mutually exclusive,
// so there is at most one) — so `checkEligibility` has a matching `byType` entry.
// If there is no candidate (e.g. a full-B holder under 65) this stays undefined
// and EligibilitySummary renders the "not eligible" floor. When selection is on
// this is false and the radio in sectionApplicationFor owns the value.
export const sectionRequirements = (freezeApplicationFor = false) =>
  buildSection({
    id: 'requirements',
    title: m.applicationEligibilityTitle,
    children: [
      buildMultiField({
        id: 'info',
        title: m.applicationEligibilityTitle,
        description: m.eligibilityRequirementTitle,
        children: [
          ...(freezeApplicationFor
            ? [
                buildHiddenInput({
                  id: 'applicationFor',
                  defaultValue: (application: Application) =>
                    structuralCandidates(
                      application.externalData,
                      getValueViaPath<DrivingLicenseFakeData>(
                        application.answers,
                        'fakeData',
                      ),
                    )[0],
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
