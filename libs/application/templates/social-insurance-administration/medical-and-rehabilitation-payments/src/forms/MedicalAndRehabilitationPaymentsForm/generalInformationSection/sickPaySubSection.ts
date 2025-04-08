import {
  buildDateField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import {
  getApplicationAnswers,
  getYesNoNotApplicableOptions,
} from '../../../lib/medicalAndRehabilitationPaymentsUtils'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const sickPaySubSection = buildSubSection({
  id: 'sickPaySubSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.generalInformation
      .sickPaySubSectionTitle,
  children: [
    buildMultiField({
      id: 'sickPay',
      title:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .sickPayTitle,
      children: [
        buildRadioField({
          id: 'sickPay.option',
          options: getYesNoNotApplicableOptions(),
          required: true,
        }),
        buildDescriptionField({
          id: 'sickPay.doesEndDate.description',
          titleVariant: 'h4',
          space: 4,
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .sickPayDoesEndDateTitle,
          condition: (answers) => {
            const { sickPayOption } = getApplicationAnswers(answers)

            return sickPayOption === NO
          },
        }),
        buildDateField({
          id: 'sickPay.doesEndDate', // When does your sick pay entitlement end?
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          required: true,
          condition: (answers) => {
            const { sickPayOption } = getApplicationAnswers(answers)

            return sickPayOption === NO
          },
        }),
        buildDescriptionField({
          id: 'sickPay.didEndDate.description',
          titleVariant: 'h4',
          space: 4,
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .sickPayDidEndDateTitle,
          condition: (answers) => {
            const { sickPayOption } = getApplicationAnswers(answers)

            return sickPayOption === YES
          },
        }),
        buildDateField({
          id: 'sickPay.didEndDate', // When did your sick pay entitlement end?
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          required: true,
          condition: (answers) => {
            const { sickPayOption } = getApplicationAnswers(answers)

            return sickPayOption === YES
          },
        }),
      ],
    }),
  ],
})
