import {
  buildSubSection,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'

export const RentalPeriodSecurityDeposit = buildSubSection({
  id: 'rentalPeriodSecurityDeposit',
  title: 'Trygging',
  children: [
    buildMultiField({
      id: 'rentalPeriodSecurityDepositDetails',
      title: 'LeiguTrygging multiFields',
      children: [
        buildTextField({
          id: 'rentalPeriodSecurityDepositInput',
          title: 'LeiguTrygging textField',
          format: 'text',
        }),
      ],
    }),
  ],
})
