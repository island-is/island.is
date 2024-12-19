import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
} from '@island.is/application/core'
import { housingFireProtections } from '../../lib/messages'
import { Routes } from '../../lib/constants'

export const RentalHousingFireProtections = buildSubSection({
  id: Routes.FIREPROTECTIONS,
  title: housingFireProtections.subSectionName,
  children: [
    buildMultiField({
      id: Routes.FIREPROTECTIONS,
      title: housingFireProtections.pageTitle,
      description: housingFireProtections.pageDescription,
      children: [
        buildDescriptionField({
          id: 'fireProtections.smokeDetectorsFireExtinguisherRequirements',
          title: '',
          description:
            housingFireProtections.smokeDetectorsFireExtinguisherRequirements,
          space: 0,
        }),
        buildTextField({
          id: 'fireProtections.smokeDetectors',
          title: housingFireProtections.smokeDetectorsLabel,
          placeholder: '0',
          width: 'half',
          variant: 'number',
        }),
        buildTextField({
          id: 'fireProtections.fireExtinguisher',
          title: housingFireProtections.fireExtinguisherLabel,
          placeholder: '0',
          width: 'half',
          variant: 'number',
        }),
        buildDescriptionField({
          id: 'fireProtections.exitFireBlanketRequirements',
          title: '',
          description: housingFireProtections.exitFireBlanketRequirements,
          space: 4,
        }),
        buildTextField({
          id: 'fireProtections.exits',
          title: housingFireProtections.exitsLabel,
          placeholder: '0',
          width: 'half',
          variant: 'number',
        }),
        buildTextField({
          id: 'fireProtections.fireBlanket',
          title: housingFireProtections.fireBlanketLabel,
          placeholder: '0',
          width: 'half',
          variant: 'number',
        }),
      ],
    }),
  ],
})
