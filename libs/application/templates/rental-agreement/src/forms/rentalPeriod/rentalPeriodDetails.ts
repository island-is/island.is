import {
  buildSubSection,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'

export const RentalPeriodDetails = buildSubSection({
  id: 'rentalPeriodDetails',
  title: 'Tímabil',
  children: [
    buildMultiField({
      title: 'Leigutími',
      children: [
        buildTextField({
          id: 'rentalPeriodInput',
          title: 'Leigutími',
          format: 'text',
        }),
      ],
    }),
  ],
})
