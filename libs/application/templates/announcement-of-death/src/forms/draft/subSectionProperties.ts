import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildCustomField,
  buildCheckboxField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

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
          id: 'realEstateAndLandsRepeater',
          component: 'RealEstateAndLandsRepeater',
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
          options: [
            {
              label: m.otherPropertiesAccounts,
              value: 'option1',
            },
            {
              label: m.otherPropertiesOwnBusiness,
              value: 'option2',
            },
            {
              label: m.otherPropertiesResidence,
              value: 'option3',
            },
            {
              label: m.otherPropertiesAssetsAbroad,
              value: 'option4',
            },
          ],
        }),
      ],
    }),
  ],
})
