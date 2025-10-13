import {
  buildDescriptionField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { hasOtherPayer, hasPayer } from '../../../utils/conditionUtils'
import { PayerOption } from '../../../utils/constants'

export const payerSubSection = buildSubSection({
  id: 'payerSubSection',
  title: newPrimarySchoolMessages.differentNeeds.payerSubSectionTitle,
  condition: (answers) => hasPayer(answers),
  children: [
    buildMultiField({
      id: 'payer',
      title: newPrimarySchoolMessages.differentNeeds.payerTitle,
      description: newPrimarySchoolMessages.differentNeeds.payerDescription,
      children: [
        buildRadioField({
          id: 'payer.option',
          width: 'full',
          required: true,
          space: 0,
          options: [
            {
              label:
                newPrimarySchoolMessages.differentNeeds.payerOptionApplicant,
              dataTestId: 'payer-option-applicant',
              value: PayerOption.APPLICANT,
            },
            {
              label: newPrimarySchoolMessages.differentNeeds.payerOptionOther,
              dataTestId: 'payer-option-other',
              value: PayerOption.OTHER,
            },
          ],
        }),
        buildDescriptionField({
          id: 'payer.other.description',
          title: newPrimarySchoolMessages.differentNeeds.payerInformation,
          description:
            newPrimarySchoolMessages.differentNeeds.payerInformationDescription,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => hasOtherPayer(answers),
        }),
        buildNationalIdWithNameField({
          id: 'payer.other',
          required: true,
          searchPersons: true,
          searchCompanies: true,
          clearOnChange: ['payer.other.name'],
          showEmailField: true,
          emailRequired: true,
          condition: (answers) => hasOtherPayer(answers),
        }),
      ],
    }),
  ],
})
