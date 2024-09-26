import {
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const RentalHousingPropertyInfo = buildSubSection({
  id: 'rentalHousingPropertyInfo',
  title: m.registerHousingProperty.subSectionName,
  children: [
    buildMultiField({
      id: 'rentalHousingPropertyInfo',
      title: m.registerHousingProperty.pageTitle,
      description: m.registerHousingProperty.pageDescription,
      children: [
        buildTextField({
          id: 'propertyAddress',
          title: m.registerHousingProperty.addressLabel,
          placeholder: m.registerHousingProperty.addressPlaceholder,
          variant: 'text',
          defaultValue: '',
        }),
      ],
    }),
  ],
})
