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

export const employeeSickPaySubSection = buildSubSection({
  id: 'employeeSickPaySubSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.generalInformation
      .employeeSickPaySubSectionTitle,
  children: [
    buildMultiField({
      id: 'employeeSickPay',
      title:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .employeeSickPayTitle,
      children: [
        buildRadioField({
          id: 'employeeSickPay.option',
          options: getYesNoNotApplicableOptions(),
          required: true,
        }),
        buildDescriptionField({
          id: 'employeeSickPay.doesEndDate.description',
          titleVariant: 'h4',
          space: 4,
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .employeeSickPayDoesEndDateTitle,
          condition: (answers) => {
            const { employeeSickPayOption } = getApplicationAnswers(answers)
            return employeeSickPayOption === NO
          },
        }),
        buildDateField({
          id: 'employeeSickPay.doesEndDate', // When does your sick pay entitlement end?
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          required: true,
          condition: (answers) => {
            const { employeeSickPayOption } = getApplicationAnswers(answers)
            return employeeSickPayOption === NO
          },
        }),
        buildDescriptionField({
          id: 'employeeSickPay.didEndDate.description',
          titleVariant: 'h4',
          space: 4,
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .employeeSickPayDidEndDateTitle,
          condition: (answers) => {
            const { employeeSickPayOption } = getApplicationAnswers(answers)
            return employeeSickPayOption === YES
          },
        }),
        buildDateField({
          id: 'employeeSickPay.didEndDate', // When did your sick pay entitlement end?
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          required: true,
          condition: (answers) => {
            const { employeeSickPayOption } = getApplicationAnswers(answers)
            return employeeSickPayOption === YES
          },
        }),
      ],
    }),
  ],
})
