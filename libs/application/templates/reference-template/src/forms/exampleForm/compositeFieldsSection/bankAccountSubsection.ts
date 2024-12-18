import {
  buildBankAccountField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'

export const bankAccountSubsection = buildSubSection({
  id: 'bankAccountSubSection',
  title: 'Bank account',
  children: [
    buildMultiField({
      id: 'bankAccountMultiField',
      title: 'Bank account field',
      children: [
        buildBankAccountField({
          id: 'bankAccountfield',
          title: '',
        }),
      ],
    }),
  ],
})
