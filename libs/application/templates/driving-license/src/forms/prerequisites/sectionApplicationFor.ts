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
import { B_FULL, B_TEMP, DrivingLicenseApplicationFor } from '../../shared'

export const sectionApplicationFor = buildSubSection({
  id: 'applicationFor',
  title: m.applicationDrivingLicenseTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: '', //m.applicationDrivingLicenseTitle,
      children: [
        buildDescriptionField({
          id: 'dynamicApplicationTitle',
          title: ({ externalData }) => {
            const applicationFor = getValueViaPath<DrivingLicenseApplicationFor>(
              externalData,
              'currentLicense.data.applicationFor',
            )
            return applicationFor === B_TEMP
              ? 'Tegund umsóknar: Bráðabirgðaskírteini'
              : 'Tegund umsóknar: Fullnaðarskírteini'
          },
          marginBottom: 4,
        }),
        buildKeyValueField({
          label: m.overviewName,
          width: 'half',
          value: ({ externalData: { nationalRegistry } }) =>
            (nationalRegistry.data as NationalRegistryUser).fullName,
        }),
        buildKeyValueField({
          label: 'Réttindi umsækjenda',
          width: 'half',
          value: ({ externalData }) =>
            getValueViaPath<DrivingLicenseApplicationFor>(
              externalData,
              'currentLicense.data.applicationFor',
              B_FULL,
            ) === B_FULL
              ? 'Almenn ökuréttindi - B flokkur (fólksbifreið)'
              : 'Engin',
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
