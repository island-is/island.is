import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildTextField,
  buildRadioField,
  YES,
  NO,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import {
  nationalIdPreface,
  getNationalIdPrefix,
} from '../../../utils/assigneeUtils'
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
        buildRadioField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assetDeclerationRadio'),
          title: m.assigneeDraft.assetDeclerationRadioTitle,
          description: m.assigneeDraft.assetDeclerationRadioDescription,
          options: [
            { label: m.miscMessages.yes, value: YES },
            { label: m.miscMessages.no, value: NO },
          ],
          marginBottom: 4,
        }),
        buildTextField({
          condition: (_answers, _externalData, user) => {
            if (!user) return false
            const prefix = getNationalIdPrefix(user)
            return (
              getValueViaPath(_answers, `${prefix}.assetDeclerationRadio`) ===
              YES
            )
          },
          id: (application, user) =>
            nationalIdPreface(application, user, 'assetDeclerationTextField'),
          description: m.assigneeDraft.assetDeclerationTextFieldDescription,
          variant: 'textarea',
          rows: 10,
        }),
      ],
    }),
  ],
})
