import {
  buildSubSection,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'

export const RentalPeriodAmount = buildSubSection({
  id: 'rentalPeriodAmount',
  title: 'Leiguupphæð',
  children: [
    buildMultiField({
      id: 'rentalPeriodAmountDetails',
      title: 'Leiguupphæð',
      children: [
        buildTextField({
          id: 'rentalPeriodAmountInput',
          title: 'Leiguupphæð',
          format: 'text',
          defaultValue: 'default value',
        }),
      ],
    }),
  ],
})
