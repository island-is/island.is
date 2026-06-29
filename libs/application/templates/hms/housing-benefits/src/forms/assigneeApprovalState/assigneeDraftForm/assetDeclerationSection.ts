import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { nationalIdPreface } from '../../../utils/assigneeUtils'
import { doesAssigneeAddressMatchRentalContract } from '../../../utils/rentalAgreementUtils'

export const assetDeclerationSection = buildSection({
  condition: (answers, externalData, user) =>
    doesAssigneeAddressMatchRentalContract(answers, externalData, user),
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
          required: true,
        }),
      ],
    }),
  ],
})
