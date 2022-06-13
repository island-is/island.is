import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildCustomField,
  buildCheckboxField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { OtherPropertiesEnum } from '../../types'

export const subSectionProperties = buildSubSection({
  id: 'propertiesStep',
  title: m.propertiesTitle,
  children: [
    buildMultiField({
      id: 'propertiesTitle',
      title: m.propertiesTitle,
      description: m.propertiesDescription,
      space: 1,
      children: [
        buildDescriptionField({
          id: 'realEstatesAndLandsTitle',
          title: m.realEstatesTitle,
          titleVariant: 'h3',
          description: m.realEstatesDescription,
        }),
        buildCustomField({
          title: 'realEstateAndLandsRepeater',
          id: 'assets',
          component: 'RealEstateAndLandsRepeater',
          childInputIds: ['assets.assets', 'assets.encountered'],
        }),
        buildDescriptionField({
          id: 'vehiclesTitle',
          title: m.vehiclesTitle,
          description: m.vehiclesDescription,
          space: 5,
          titleVariant: 'h3',
        }),
        buildCustomField({
          title: 'Vehicles!',
          id: 'vehicles',
          component: 'VehiclesRepeater',
          childInputIds: ['vehicles.vehicles', 'vehicles.encountered'],
        }),
        buildDescriptionField({
          id: 'otherPropertiesTitle',
          title: m.otherPropertiesTitle,
          titleVariant: 'h3',
          description: m.otherPropertiesDescription,
          space: 5,
        }),
        buildCheckboxField({
          id: 'otherProperties',
          title: '',
          large: false,
          backgroundColor: 'white',
          doesNotRequireAnswer: true,
          defaultValue: '',
          options: [
            {
              label: m.otherPropertiesAccounts,
              value: OtherPropertiesEnum.ACCOUNTS,
            },
            {
              label: m.otherPropertiesOwnBusiness,
              value: OtherPropertiesEnum.OWN_BUSINESS,
            },
            {
              label: m.otherPropertiesResidence,
              value: OtherPropertiesEnum.RESIDENCE,
            },
            {
              label: m.otherPropertiesAssetsAbroad,
              value: OtherPropertiesEnum.ASSETS_ABROAD,
            },
          ],
        }),
      ],
    }),
  ],
})
