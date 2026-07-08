import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { nationalIdPreface } from '../../../utils/assigneeUtils'
import { isAssigneeTaxReturnNotFiled } from '../../../utils/utils'

export const incomeDeclarationSection = buildSection({
  condition: isAssigneeTaxReturnNotFiled,
  id: 'incomeDeclarationSection',
  title: m.assigneeDraft.incomeDeclarationTitle,
  children: [
    buildMultiField({
      id: 'incomeDeclarationMultiField',
      title: m.assigneeDraft.incomeDeclarationMultiFieldTitle,
      children: [
        buildDescriptionField({
          id: 'incomeDeclarationDescription',
          description: m.assigneeDraft.incomeDeclarationDescription,
        }),
        buildDescriptionField({
          id: 'incomeDeclarationDescription2',
          description: m.assigneeDraft.incomeDeclarationDescription2,
          marginBottom: 4,
        }),
        buildTextField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'incomeDeclarationTextField'),
          title: m.assigneeDraft.incomeDeclarationTextFieldDescription,
          variant: 'textarea',
          rows: 10,
          required: true,
        }),
      ],
    }),
  ],
})
