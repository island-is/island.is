import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const RentalHousingSpecialProvisions = buildSubSection({
  id: 'RentalHousingSpecialProvisions',
  title: m.specialProvisions.subsection.name,
  children: [
    buildMultiField({
      id: 'rentalHousingSpecialProvisionsDetails',
      title: m.specialProvisions.subsection.pageTitle,
      description: m.specialProvisions.subsection.pageDescription,
      children: [
        buildDescriptionField({
          id: 'rentalHousingSpecialProvisionsDescriptionTitle',
          title: m.specialProvisions.housingInfo.title,
          titleTooltip: m.specialProvisions.housingInfo.tooltip,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: 'rentalHousingSpecialProvisionsDescriptionInput',
          title: m.specialProvisions.housingInfo.inputLabel,
          maxLength: 1500,
          placeholder: m.specialProvisions.housingInfo.inputPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
        buildDescriptionField({
          id: 'rentalHousingSpecialProvisionsTitle',
          title: m.specialProvisions.housingRules.title,
          titleTooltip: m.specialProvisions.housingRules.tooltip,
          titleVariant: 'h3',
          marginTop: 6,
        }),
        buildTextField({
          id: 'rentalHousingSpecialProvisionsInput',
          title: m.specialProvisions.housingRules.inputLabel,
          placeholder: m.specialProvisions.housingRules.inputPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
      ],
    }),
  ],
})
