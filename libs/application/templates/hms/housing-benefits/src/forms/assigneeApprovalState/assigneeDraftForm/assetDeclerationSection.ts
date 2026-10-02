import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { nationalIdPreface } from '../../../utils/assigneeUtils'
import { MAX_TEXT_LENGTH } from '../../../utils/constants'
import { isAssigneeTaxReturnNotFiled } from '../../../utils/utils'

export const assetDeclerationSection = buildSection({
  condition: isAssigneeTaxReturnNotFiled,
  id: 'assetDeclerationSection',
  title: m.assigneeDraft.assetDeclerationTitle,
  children: [
    buildMultiField({
      id: 'assetDeclerationMultiField',
      title: m.assigneeDraft.assetDeclerationMultiFieldTitle,
      children: [
        buildDescriptionField({
          id: 'assetDeclerationDescription',
          description: m.assigneeDraft.assetDeclerationDescription,
        }),
        buildDescriptionField({
          id: 'assetDeclerationDescription2',
          description: m.assigneeDraft.assetDeclerationDescription2,
          marginBottom: 4,
        }),
        buildTextField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assetDeclerationTextField'),
          title: m.assigneeDraft.assetDeclerationTextFieldDescription,
          variant: 'textarea',
          rows: 10,
          maxLength: MAX_TEXT_LENGTH,
          required: true,
        }),
      ],
    }),
  ],
})
