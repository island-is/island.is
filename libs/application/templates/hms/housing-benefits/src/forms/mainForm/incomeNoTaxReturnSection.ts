import {
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { isTaxReturnNotFiled } from '../../utils/utils'
import { MAX_TEXT_LENGTH } from '../../utils/constants'

export const incomeNoTaxReturnSection = buildSection({
  id: 'incomeNoTaxReturnSection',
  title: m.draftMessages.incomeNoTaxReturnSection.title,
  condition: isTaxReturnNotFiled,
  children: [
    buildMultiField({
      id: 'incomeNoTaxReturnMultiField',
      title: m.draftMessages.incomeNoTaxReturnSection.multiFieldTitle,
      description:
        m.draftMessages.incomeNoTaxReturnSection.multiFieldDescription,
      children: [
        buildTextField({
          id: 'incomeNoTaxReturnDescription',
          title: m.draftMessages.incomeNoTaxReturnSection.descriptionTitle,
          description:
            m.draftMessages.incomeNoTaxReturnSection.descriptionDescription,
          variant: 'textarea',
          rows: 6,
          required: true,
          maxLength: MAX_TEXT_LENGTH,
          marginBottom: 4,
        }),
      ],
    }),
  ],
})
