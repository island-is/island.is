import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { Routes } from '../../../lib/constants'
import { personalTaxCreditOptions } from '../../../utils/options'

export const personalTaxCreditSubsection = buildSubSection({
  id: Routes.PERSONALTAXCREDIT,
  title: m.personalTaxCreditForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.PERSONALTAXCREDIT,
      title: m.personalTaxCreditForm.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'personalTaxCreditDescription',
          title: '',
          description: m.personalTaxCreditForm.general.recommendedChoice,
        }),
        buildRadioField({
          id: 'personalTaxCredit',
          title: '',
          options: personalTaxCreditOptions,
          width: 'half',
        }),
        buildDescriptionField({
          id: 'personalTaxCreditDescription2',
          title: m.personalTaxCreditForm.general.descriptionTitle,
          titleVariant: 'h4',
          description: m.personalTaxCreditForm.general.description,
        }),
      ],
    }),
  ],
})
