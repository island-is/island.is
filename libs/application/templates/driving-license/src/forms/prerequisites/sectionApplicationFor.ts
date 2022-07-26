import { NationalRegistryUser } from '@island.is/api/schema'
import {
  buildCustomField,
  buildKeyValueField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { CurrentLicenseProviderResult } from '../../dataProviders/CurrentLicenseProvider'
import { m } from '../../lib/messages'
import { B_FULL, B_TEMP } from '../../shared'

export const sectionApplicationFor = buildSubSection({
  id: 'applicationFor',
  title: m.applicationDrivingLicenseTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.drivingLicenseApplyingForTitle,
      children: [
        buildKeyValueField({
          label: m.overviewName,
          width: 'half',
          value: ({ externalData: { nationalRegistry } }) =>
            (nationalRegistry.data as NationalRegistryUser).fullName,
        }),
        buildKeyValueField({
          label: 'Réttindi umsækjenda',
          width: 'half',
          value: ({ externalData: { nationalRegistry } }) =>
            (nationalRegistry.data as NationalRegistryUser).fullName,
        }),
        buildCustomField({
          title: m.eligibilityRequirementTitle,
          component: 'EligibilitySummary',
          id: 'eligsummary',
        }),
      ],
    }),
  ],
})
