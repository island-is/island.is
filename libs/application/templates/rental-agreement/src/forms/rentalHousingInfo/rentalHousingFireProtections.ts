import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const RentalHousingFireProtections = buildSubSection({
  id: 'fireProtections',
  title: m.housingFireProtections.subSectionName,
  children: [
    buildMultiField({
      id: 'fireProtections.multiField',
      title: m.housingFireProtections.pageTitle,
      description: m.housingFireProtections.pageDescription,
      children: [
        buildDescriptionField({
          id: 'fireProtections.smokeDetectorsFireExtinguisherRequirements',
          title: '',
          description:
            m.housingFireProtections.smokeDetectorsFireExtinguisherRequirements,
          space: 0,
        }),
        buildTextField({
          id: 'fireProtections.smokeDetectors',
          title: m.housingFireProtections.smokeDetectorsLabel,
          placeholder: '0',
          width: 'half',
          variant: 'number',
        }),
        buildTextField({
          id: 'fireProtections.fireExtinguisher',
          title: m.housingFireProtections.fireExtinguisherLabel,
          placeholder: '0',
          width: 'half',
          variant: 'number',
        }),
        buildDescriptionField({
          id: 'fireProtections.exitFireBlanketRequirements',
          title: '',
          description: m.housingFireProtections.exitFireBlanketRequirements,
          space: 4,
        }),
        buildTextField({
          id: 'fireProtections.exits',
          title: m.housingFireProtections.exitsLabel,
          placeholder: '0',
          width: 'half',
          variant: 'number',
        }),
        buildTextField({
          id: 'fireProtections.fireBlanket',
          title: m.housingFireProtections.fireBlanketLabel,
          placeholder: '0',
          width: 'half',
          variant: 'number',
        }),
      ],
    }),
  ],
})
