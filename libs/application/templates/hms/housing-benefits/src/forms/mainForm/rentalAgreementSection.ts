import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { rentalContractOptions } from '../../utils/rentalAgreementOptions'

export const rentalAgreementSection = buildSection({
  id: 'rentalAgreementSection',
  title: m.draftMessages.rentalAgreement.title,
  children: [
    buildMultiField({
      id: 'rentalAgreementMultiField',
      title: m.draftMessages.rentalAgreement.title,
      description: m.draftMessages.rentalAgreement.multiFieldDescription,
      children: [
        buildDescriptionField({
          id: 'rentalAgreementDescription',
          description: m.draftMessages.rentalAgreement.description,
          marginBottom: 4,
        }),
        buildRadioField({
          id: 'rentalAgreement.answer',
          clearOnChange: [
            'exemptionCheckbox',
            'exemptionReason',
            'exemptionDocuments.studies',
            'exemptionDocuments.health',
            'exemptionDocuments.housing',
            'exemptionDocuments.work',
          ],
          options: rentalContractOptions,
        }),
      ],
    }),
  ],
})
