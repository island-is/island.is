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

          title:
            medicalAndRehabilitationPaymentsFormMessage.pre
              .applicationTypeTitle,
          description:
            medicalAndRehabilitationPaymentsFormMessage.pre
              .applicationTypeDescription,
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
          id: 'sickPay.doesEndDate', // Hvenær líkur rétti þínum til veikindalauna
          defaultValue: '',
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          required: true,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
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
          id: 'sickPay.didEndDate', // Hvenær lauk rétti þínum til veikindalauna
          defaultValue: '',
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          required: true,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          condition: (answers) => {
            const { sickPayOption } = getApplicationAnswers(answers)

            return sickPayOption === YES
          },
        }),
      ],
    }),
  ],
})
