import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const RentalHousingSpecialProvisions = buildSubSection({
  id: 'RentalHousingSpecialProvisions',
  title: m.specialProvisions.subSectionName,
  children: [
    buildMultiField({
      id: 'rentalHousingSpecialProvisionsDetails',
      title: m.specialProvisions.pageTitle,
      description: m.specialProvisions.pageDescription,
      children: [
        buildDescriptionField({
          id: 'rentalHousingSpecialProvisionsDescriptionTitle',
          title: m.specialProvisions.housingDescriptionTitle,
          titleTooltip: m.specialProvisions.housingDescriptionTitleTooltip,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'rentalHousingSpecialProvisionsDescriptionInput',
          title: m.specialProvisions.housingDescriptionInputLabel,
          placeholder: m.specialProvisions.housingDescriptionInputPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
      ],
    }),
    buildMultiField({
      id: 'rentalHousingSpecialProvisionsDetails',
      title: m.specialProvisions.pageTitle,
      description: m.specialProvisions.pageDescription,
      children: [
        buildDescriptionField({
          id: 'rentalHousingSpecialProvisionsTitle',
          title: m.specialProvisions.housingRulesDescriptionTitle,
          titleTooltip: m.specialProvisions.housingRulesDescriptionTitleTooltip,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'rentalHousingSpecialProvisionsInput',
          title: m.specialProvisions.housingRulesDescriptionInputLabel,
          placeholder:
            m.specialProvisions.housingRulesDescriptionInputPlaceholder,
          variant: 'textarea',
          rows: 8,
        }),
      ],
    }),
  ],
})
