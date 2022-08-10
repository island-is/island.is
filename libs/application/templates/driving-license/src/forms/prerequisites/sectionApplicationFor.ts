import { NationalRegistryUser } from '@island.is/api/schema'
import {
  buildCustomField,
  buildKeyValueField,
  buildMultiField,
  buildRadioField,
  buildSubmitField,
  buildSubSection,
  getValueViaPath,
  buildDescriptionField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { CurrentLicenseProviderResult } from '../../dataProviders/CurrentLicenseProvider'
import { m } from '../../lib/messages'
import { isApplicationForCondition, isExpiring } from '../../lib/utils'
import { B_FULL, B_RENEW, B_TEMP, DrivingLicenseApplicationFor } from '../../shared'

export const sectionApplicationFor = buildSubSection({
  id: 'applicationFor',
  title: m.applicationDrivingLicenseTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.applicantRights,
      children: [
        buildCustomField({
          condition: (answers, externalData) => {
            const currentLicense = getValueViaPath<CurrentLicenseProviderResult>(
              externalData,
              'currentLicense.data',
            )
            return isApplicationForCondition(B_RENEW) && !isExpiring(currentLicense?.expires)
          },

          title: 'SubmitAndDecline',
          component: 'SubmitAndDecline',
          id: 'SubmitAndDecline',
        }),
        buildCustomField({
          title: m.eligibilityRequirementTitle,
          component: 'EligibilitySummary',
          id: 'eligsummary',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: m.orderDrivingLicense,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.continue,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
