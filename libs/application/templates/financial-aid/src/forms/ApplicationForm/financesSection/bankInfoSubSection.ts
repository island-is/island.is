import {
  buildSubSection,
  buildMultiField,
  buildDescriptionField,
  buildTextField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'

export const bankInfoSubSection = buildSubSection({
  id: Routes.BANKINFO,
  title: m.bankInfoForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.BANKINFO,
      title: m.bankInfoForm.general.pageTitle,
      description: m.bankInfoForm.general.info,
      children: [
        buildTextField({
          id: `${Routes.BANKINFO}.accountNumber`,
          title: m.bankInfoForm.inputsLabels.bankNumber,
          format: '####-##-######',
          placeholder: '0000-00-000000',
        }),
        buildDescriptionField({
          id: `${Routes.BANKINFO}.description`,
          title: m.bankInfoForm.general.descriptionTitle,
          titleVariant: 'h3',
          marginTop: 3,
          description: m.bankInfoForm.general.description,
        }),
      ],
    }),
  ],
})
