import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const RentalHousingFireProtections = buildSubSection({
  id: 'rentalHousingFireProtections',
  title: m.housingFireProtections.subSectionName,
  children: [
    buildMultiField({
      id: 'rentalHousingFireProtections',
      title: m.housingFireProtections.pageTitle,
      description: m.housingFireProtections.pageDescription,
      children: [
        buildDescriptionField({
          id: 'rentalHousingFireProtectionsSmokeDetectorsFireExtinguisherRequirements',
          title: '',
          description:
            m.housingFireProtections.smokeDetectorsFireExtinguisherRequirements,
          space: 0,
        }),
        buildTextField({
          id: 'rentalHousingFireProtectionsSmokeDetectors',
          title: m.housingFireProtections.smokeDetectorsLabel,
          placeholder: '0',
          width: 'half',
          variant: 'number',
        }),
        buildTextField({
          id: 'rentalHousingFireProtectionsFireExtinguisher',
          title: m.housingFireProtections.fireExtinguisherLabel,
          placeholder: '0',
          width: 'half',
          variant: 'number',
        }),
        buildDescriptionField({
          id: 'rentalHousingFireProtectionsExitFireBlanketRequirements',
          title: '',
          description: m.housingFireProtections.exitFireBlanketRequirements,
          space: 4,
        }),
        buildTextField({
          id: 'rentalHousingFireProtectionsExits',
          title: m.housingFireProtections.exitsLabel,
          placeholder: '0',
          width: 'half',
          variant: 'number',
        }),
        buildTextField({
          id: 'rentalHousingFireProtectionsFireBlanket',
          title: m.housingFireProtections.fireBlanketLabel,
          placeholder: '0',
          width: 'half',
          variant: 'number',
        }),
      ],
    }),
  ],
})
