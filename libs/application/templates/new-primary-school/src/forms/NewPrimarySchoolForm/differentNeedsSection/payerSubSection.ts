import {
  buildDescriptionField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { differentNeedsMessages } from '../../../lib/messages'
import { hasOtherPayer, shouldShowPage } from '../../../utils/conditionUtils'
import { ApplicationFeatureKey, PayerOption } from '../../../utils/constants'

export const payerSubSection = buildSubSection({
  id: 'payerSubSection',
  title: differentNeedsMessages.payer.subSectionTitle,
  condition: (answers, externalData) =>
    shouldShowPage(answers, externalData, ApplicationFeatureKey.PAYMENT_INFO),
  children: [
    buildMultiField({
      id: 'payer',
      title: differentNeedsMessages.payer.title,
      description: differentNeedsMessages.payer.description,
      children: [
        buildRadioField({
          id: 'payer.option',
          width: 'full',
          required: true,
          space: 0,
          options: [
            {
              label: differentNeedsMessages.payer.optionApplicant,
              dataTestId: 'payer-option-applicant',
              value: PayerOption.APPLICANT,
            },
            {
              label: differentNeedsMessages.payer.optionOther,
              dataTestId: 'payer-option-other',
              value: PayerOption.OTHER,
            },
          ],
        }),
        buildDescriptionField({
          id: 'payer.other.description',
          title: differentNeedsMessages.payer.information,
          description: differentNeedsMessages.payer.informationDescription,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => hasOtherPayer(answers),
        }),
        buildNationalIdWithNameField({
          id: 'payer.other',
          required: true,
          searchPersons: true,
          searchCompanies: true,
          condition: (answers) => hasOtherPayer(answers),
        }),
      ],
    }),
  ],
})
