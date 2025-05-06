import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
  buildHiddenInputWithWatchedValue,
} from '@island.is/application/core'
import { Routes } from '../../../utils/enums'
import { housingFireProtections } from '../../../lib/messages'

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
          description: housingFireProtections.exitFireBlanketRequirements,
          space: 4,
        }),
        buildTextField({
          id: 'fireProtections.emergencyExits',
          title: housingFireProtections.exitsTitle,
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
        buildHiddenInputWithWatchedValue({
          id: 'fireProtections.propertySize',
          watchValue: 'registerProperty.size',
        }),
      ],
    }),
  ],
})
