import {
  buildBankAccountField,
  buildSubSection,
} from '@island.is/application/core'

export const bankAccountSubsection = buildSubSection({
  id: 'bankAccountSubSection',
  title: 'Bank account',
  children: [
    buildBankAccountField({
      id: 'bankAccountfield',
      title: 'Bank account field',
    }),
  ],
})
