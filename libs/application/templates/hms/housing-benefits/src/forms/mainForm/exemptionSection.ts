import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildCheckboxField,
  buildRadioField,
} from '@island.is/application/core'
import { doesAddressMatchRentalContract } from '../../utils/rentalAgreementUtils'
import * as m from '../../lib/messages'
import { isExemptionRequested } from '../../utils/utils'

export const exemptionSection = buildSection({
  condition: (answers, externalData) =>
    !doesAddressMatchRentalContract(answers, externalData),
  id: 'exemptionSection',
  title: m.draftMessages.exemptionSection.title,
  children: [
    buildMultiField({
      id: 'exemptionMultiField',
      title: m.draftMessages.exemptionSection.multiFieldTitle,
      children: [
        buildAlertMessageField({
          id: 'exemptionAlert',
          title: m.draftMessages.exemptionSection.alertTitle,
          message: m.draftMessages.exemptionSection.description,
          alertType: 'warning',
        }),
        buildDescriptionField({
          id: 'exemptionDescription',
          description: m.draftMessages.exemptionSection.description2,
          marginBottom: 4,
        }),
        buildCheckboxField({
          id: 'exemptionCheckbox',
          options: [
            {
              value: 'yes',
              label: m.draftMessages.exemptionSection.checkboxLabel,
            },
          ],
          marginBottom: 4,
        }),
        buildRadioField({
          condition: isExemptionRequested,
          id: 'exemptionReason',
          title: m.draftMessages.exemptionSection.checkboxTitle,
          marginBottom: 4,
          options: [
            {
              value: 'studies',
              label: m.draftMessages.exemptionSection.checkboxLabelStudies,
            },
            {
              value: 'health',
              label: m.draftMessages.exemptionSection.checkboxLabelHealth,
            },
            {
              value: 'housing',
              label: m.draftMessages.exemptionSection.checkboxLabelHousing,
            },
            {
              value: 'work',
              label: m.draftMessages.exemptionSection.checkboxLabelWork,
            },
          ],
        }),
      ],
    }),
  ],
})
