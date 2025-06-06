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
} from '../../../utils/medicalAndRehabilitationPaymentsUtils'
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
          id: 'employeeSickPay.hasUtilizedEmployeeSickPayRights',
          options: getYesNoNotApplicableOptions(),
          required: true,
        }),
        buildDescriptionField({
          id: 'employeeSickPay.endDate.description',
          title: (application) => {
            const { hasUtilizedEmployeeSickPayRights } = getApplicationAnswers(
              application.answers,
            )

            if (hasUtilizedEmployeeSickPayRights === YES) {
              return medicalAndRehabilitationPaymentsFormMessage
                .generalInformation.employeeSickPayDidEndDateTitle
            }

            return medicalAndRehabilitationPaymentsFormMessage
              .generalInformation.employeeSickPayDoesEndDateTitle
          },
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => {
            const { hasUtilizedEmployeeSickPayRights } =
              getApplicationAnswers(answers)
            return (
              hasUtilizedEmployeeSickPayRights === YES ||
              hasUtilizedEmployeeSickPayRights === NO
            )
          },
        }),
        buildDateField({
          id: 'employeeSickPay.endDate',
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          required: true,
          condition: (answers) => {
            const { hasUtilizedEmployeeSickPayRights } =
              getApplicationAnswers(answers)
            return (
              hasUtilizedEmployeeSickPayRights === YES ||
              hasUtilizedEmployeeSickPayRights === NO
            )
          },
        }),
      ],
    }),
  ],
})
