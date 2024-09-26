import {
  buildSubSection,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'

export const RentalPeriodSecurityDeposit = buildSubSection({
  id: 'rentalPeriodSecurityDeposit',
  title: 'LeiguTrygging',
  children: [
    buildMultiField({
      id: 'rentalPeriodSecurityDepositDetails',
      title: 'LeiguTrygging',
      children: [
        buildTextField({
          id: 'rentalPeriodSecurityDepositInput',
          title: 'LeiguTrygging',
          format: 'text',
          defaultValue: 'default value',
        }),
      ],
    }),
  ],
})
