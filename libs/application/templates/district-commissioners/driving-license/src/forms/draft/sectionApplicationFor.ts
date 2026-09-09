import {
  buildMultiField,
  buildRadioField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  B_FULL,
  B_FULL_RENEWAL_65,
  B_TEMP,
  DrivingLicenseFakeData,
} from '../../utils/constants'
import { structuralCandidates } from '../../utils'

export const sectionApplicationFor = (allow65Renewal = false) =>
  buildSection({
    id: 'applicationFor',
    title: m.applicationDrivingLicenseTitle,
    children: [
      buildMultiField({
        id: 'info',
        title: m.applicationDrivingLicenseTitle,
        description: m.drivingLicenseApplyingForTitle,
        children: [
          buildRadioField({
            id: 'applicationFor',
            backgroundColor: 'blue',
            largeButtons: true,
            required: true,
            // Which types the applicant can structurally apply for (from their
            // current license + age) is decided here; each option disables itself
            // when it isn't a candidate. The deeper per-type requirements
            // (driving school, residency, RLS can-apply) are shown on the
            // eligibility summary that follows, not gated here.
            options: (app) => {
              const fakeData = getValueViaPath<DrivingLicenseFakeData>(
                app.answers,
                'fakeData',
              )
              const candidates = structuralCandidates(app.externalData, fakeData)

              const options: Array<{
                label: typeof m.applicationForTempLicenseTitle
                subLabel: typeof m.applicationForTempLicenseDescription
                value: string
                disabled: boolean
              }> = [
                {
                  label: m.applicationForTempLicenseTitle,
                  subLabel: m.applicationForTempLicenseDescription,
                  value: B_TEMP,
                  disabled: !candidates.includes(B_TEMP),
                },
                {
                  label: m.applicationForFullLicenseTitle,
                  subLabel: m.applicationForFullLicenseDescription,
                  value: B_FULL,
                  disabled: !candidates.includes(B_FULL),
                },
              ]

              if (allow65Renewal) {
                options.push({
                  label: m.applicationForRenewalLicenseTitle,
                  subLabel: m.applicationForRenewalLicenseDescription,
                  value: B_FULL_RENEWAL_65,
                  disabled: !candidates.includes(B_FULL_RENEWAL_65),
                })
              }

              return options
            },
          }),
        ],
      }),
    ],
  })
