import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'
import { isTaxReturnNotFiled } from '../../utils/utils'
import { draftMessages } from '../../lib/messages/draftMessages'
import { MAX_TEXT_LENGTH } from '../../utils/constants'

const m = draftMessages.assetsDeclarationSection

export const assetsDeclarationSection = buildSection({
  id: 'assetsDeclarationSection',
  title: m.title,
  condition: isTaxReturnNotFiled,
  children: [
    buildMultiField({
      id: 'assetsDeclaration',
      title: m.multiFieldTitle,
      children: [
        buildDescriptionField({
          id: 'assetsDeclarationDescription',
          description: m.description,
        }),
        buildDescriptionField({
          id: 'assetsDeclarationDescription2',
          description: m.description2,
          marginBottom: 4,
        }),
        buildTextField({
          id: 'assetsDeclarationTextField',
          title: m.textFieldDescription,
          variant: 'textarea',
          rows: 10,
          maxLength: MAX_TEXT_LENGTH,
          required: true,
        }),
      ],
    }),
  ],
})
