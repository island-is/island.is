import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { specialProvisions } from '../../../lib/messages'

export const RentalHousingSpecialProvisions = buildSubSection({
  id: Routes.SPECIALPROVISIONS,
  title: specialProvisions.subsection.name,
  children: [
    buildMultiField({
      id: Routes.SPECIALPROVISIONS,
      title: specialProvisions.subsection.pageTitle,
      description: specialProvisions.subsection.pageDescription,
      children: [
        buildDescriptionField({
          id: 'specialProvisions.descriptionTitle',
          title: specialProvisions.housingInfo.title,
          titleTooltip: specialProvisions.housingInfo.tooltip,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: 'specialProvisions.descriptionInput',
          title: specialProvisions.housingInfo.inputLabel,
          maxLength: 1500,
          placeholder: specialProvisions.housingInfo.inputPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
        buildDescriptionField({
          id: 'specialProvisions.rulesTitle',
          title: specialProvisions.housingRules.title,
          titleTooltip: specialProvisions.housingRules.tooltip,
          titleVariant: 'h3',
          marginTop: 6,
        }),
        buildTextField({
          id: 'specialProvisions.rulesInput',
          title: specialProvisions.housingRules.inputLabel,
          placeholder: specialProvisions.housingRules.inputPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
      ],
    }),
  ],
})
