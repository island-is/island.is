import {
  buildMultiField,
  buildSubSection,
  buildCheckboxField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { PropertiesEnum } from '../../types'

export const subSectionProperties = buildSubSection({
  id: 'propertiesStep',
  title: m.propertiesTitle,
  children: [
    buildMultiField({
      id: 'propertiesTitle',
      title: m.propertiesTitle,
      description: m.propertiesDescription,
      space: 2,
      children: [
        buildCheckboxField({
          id: 'otherProperties',
          large: false,
          backgroundColor: 'white',
          doesNotRequireAnswer: true,
          defaultValue: '',
          options: [
            {
              label: m.propertiesRealEstate,
              value: PropertiesEnum.REAL_ESTATE,
            },
            {
              label: m.propertiesVehicles,
              value: PropertiesEnum.VEHICLES,
            },
            {
              label: m.otherPropertiesAccounts,
              value: PropertiesEnum.ACCOUNTS,
            },
            {
              label: m.otherPropertiesOwnBusiness,
              value: PropertiesEnum.OWN_BUSINESS,
            },
            {
              label: m.otherPropertiesResidence,
              value: PropertiesEnum.RESIDENCE,
            },
            {
              label: m.otherPropertiesAssetsAbroad,
              value: PropertiesEnum.ASSETS_ABROAD,
            },
          ],
        }),
      ],
    }),
  ],
})
