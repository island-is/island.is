import {
  buildDescriptionField,
  buildMultiField,
  buildKeyValueField,
  buildSelectField,
  buildDividerField,
  buildTextField,
  buildSubSection,
  buildCustomField,
  buildCheckboxField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const subSectionProperties = buildSubSection({
  id: 'propertiesStep',
  title: 'Eignir',
  children: [
    buildMultiField({
      id: 'propertiesTitle',
      title: 'Eignir',
      description:
        'Hér skaltu lista niður upplýsingar um helstu eignir í dánarbúi. Eignir ber að tilkynna til Sýslumanns innan 30 daga frá dánardegi.',
      space: 1,
      children: [
        buildDescriptionField({
          id: 'realEstatesAndLandsTitle',
          title: 'Fasteignir og lóðir',
          titleVariant: 'h3',
        }),
        buildCustomField({
          title: 'realEstateAndLandsRepeater',
          id: 'realEstateAndLandsRepeater',
          component: 'RealEstateAndLandsRepeater',
        }),
        buildDescriptionField({
          id: 'vehiclesTitle',
          title: 'Ökutæki',
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
          title: 'Aðrar eignir',
          titleVariant: 'h3',
          description: 'Merktu við þá reiti sem að eiga við þetta ferli.',
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
              label: 'Bankareikningar, verðbréf, hlutabréf',
              value: 'option1',
            },
            {
              label: 'Eigin rekstur',
              value: 'option2',
            },
            {
              label: 'Búseturéttur',
              value: 'option3',
            },
          ],
        }),
      ],
    }),
  ],
})
