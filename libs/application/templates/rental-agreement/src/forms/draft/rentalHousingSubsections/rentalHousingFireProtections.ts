import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
  buildHiddenInputWithWatchedValue,
  buildRadioField,
} from '@island.is/application/core'
import { Routes } from '../../../utils/enums'
import { housingFireProtections } from '../../../lib/messages'
import { getYesNoOptions } from '../../../utils/utils'

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
          maxLength: 1,
          format: '#',
          min: 0,
          max: 9,
        }),
        buildTextField({
          id: 'fireProtections.fireExtinguisher',
          title: housingFireProtections.fireExtinguisherLabel,
          placeholder: '0',
          width: 'half',
          maxLength: 1,
          format: '#',
          min: 0,
          max: 9,
        }),
        buildDescriptionField({
          id: 'fireProtections.fireBlanketRequirements',
          title: housingFireProtections.fireBlanketLabel,
          titleVariant: 'h3',
          description: housingFireProtections.fireBlanketRequirements,
          space: 4,
        }),
        buildRadioField({
          id: 'fireProtections.fireBlanket',
          options: getYesNoOptions(),
          width: 'half',
          space: 0,
        }),
        buildDescriptionField({
          id: 'fireProtections.exitRequirements',
          title: housingFireProtections.exitsLabel,
          titleVariant: 'h3',
          description: housingFireProtections.exitRequirements,
          space: 4,
        }),
        buildRadioField({
          id: 'fireProtections.emergencyExits',
          options: getYesNoOptions(),
          width: 'half',
          space: 0,
        }),
        buildHiddenInputWithWatchedValue({
          id: 'fireProtections.propertySize',
          watchValue: 'registerProperty.searchresults.units',
        }),
      ],
    }),
  ],
})
