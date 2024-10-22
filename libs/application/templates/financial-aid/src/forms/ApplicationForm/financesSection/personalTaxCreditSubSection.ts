import {
  buildSubSection,
  buildMultiField,
  buildRadioField,
  buildDescriptionField,
} from '@island.is/application/core'

import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { getPersonalTaxCreditOptions } from '../../../lib/utils/getPersonalTaxCreditOptions'

export const personalTaxCreditSubSection = buildSubSection({
  id: Routes.PERSONALTAXCREDIT,
  title: m.personalTaxCreditForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.PERSONALTAXCREDIT,
      title: m.personalTaxCreditForm.general.pageTitle,
      description: m.personalTaxCreditForm.general.recommendedChoice,
      children: [
        buildRadioField({
          id: `${Routes.PERSONALTAXCREDIT}.type`,
          title: '',
          width: 'half',
          options: getPersonalTaxCreditOptions(),
        }),
        buildDescriptionField({
          id: `${Routes.PERSONALTAXCREDIT}.description`,
          title: m.personalTaxCreditForm.general.descriptionTitle,
          titleVariant: 'h3',
          marginTop: 3,
          description: m.personalTaxCreditForm.general.description,
        }),
      ],
    }),
  ],
})
