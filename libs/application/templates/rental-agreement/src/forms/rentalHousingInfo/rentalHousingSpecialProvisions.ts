import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const RentalHousingSpecialProvisions = buildSubSection({
  id: 'specialProvisions',
  title: m.specialProvisions.subsection.name,
  children: [
    buildMultiField({
      id: 'specialProvisions.details',
      title: m.specialProvisions.subsection.pageTitle,
      description: m.specialProvisions.subsection.pageDescription,
      children: [
        buildDescriptionField({
          id: 'specialProvisions.descriptionTitle',
          title: m.specialProvisions.housingInfo.title,
          titleTooltip: m.specialProvisions.housingInfo.tooltip,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: 'specialProvisions.descriptionInput',
          title: m.specialProvisions.housingInfo.inputLabel,
          maxLength: 1500,
          placeholder: m.specialProvisions.housingInfo.inputPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
        buildDescriptionField({
          id: 'specialProvisions.rulesTitle',
          title: m.specialProvisions.housingRules.title,
          titleTooltip: m.specialProvisions.housingRules.tooltip,
          titleVariant: 'h3',
          marginTop: 6,
        }),
        buildTextField({
          id: 'specialProvisions.rulesInput',
          title: m.specialProvisions.housingRules.inputLabel,
          placeholder: m.specialProvisions.housingRules.inputPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
      ],
    }),
  ],
})
