import {
  buildSubSection,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'

export const RentalPeriodOtherFees = buildSubSection({
  id: 'rentalPeriodOtherFees',
  title: 'Önnur gjöld',
  children: [
    buildMultiField({
      id: 'rentalPeriodOtherFeesDetails',
      title: 'Önnur gjöld',
      children: [
        buildTextField({
          id: 'rentalPeriodOtherFeesInput',
          title: 'Önnur gjöld',
          format: 'text',
          defaultValue: 'default value',
        }),
      ],
    }),
  ],
})
