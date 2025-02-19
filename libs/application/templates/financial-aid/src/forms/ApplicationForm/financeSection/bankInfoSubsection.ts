import {
  buildBankAccountField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { Routes } from '../../../lib/constants'

export const bankInfoSubsection = buildSubSection({
  id: Routes.BANKINFO,
  title: m.bankInfoForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'bankInfoMultiField',
      title: m.bankInfoForm.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'bankInfoDescription',
          description: m.bankInfoForm.general.info,
          marginBottom: 4,
        }),
        buildBankAccountField({
          id: Routes.BANKINFO,
        }),
        buildDescriptionField({
          id: 'bankInfoDescription2',
          title: m.bankInfoForm.general.descriptionTitle,
          titleVariant: 'h4',
          description: m.bankInfoForm.general.description,
        }),
      ],
    }),
  ],
})
