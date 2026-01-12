import {
  buildDateField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import {
  isFirstApplication,
  shouldShowEmployeeSickPayEndDate,
} from '../../../utils/conditionUtils'
import {
  getApplicationAnswers,
  getYesNoNotApplicableOptions,
  hasNotUtilizedRights,
  hasUtilizedRights,
} from '../../../utils/medicalAndRehabilitationPaymentsUtils'

export const employeeSickPaySubSection = buildSubSection({
  id: 'employeeSickPaySubSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.generalInformation
      .employeeSickPaySubSectionTitle,
  condition: (_, externalData) => isFirstApplication(externalData),
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
          clearOnChange: [`employeeSickPay.endDate`],
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
          condition: (answers) => shouldShowEmployeeSickPayEndDate(answers),
        }),
        buildDateField({
          id: 'employeeSickPay.endDate',
          minDate: (application) => {
            const { hasUtilizedEmployeeSickPayRights } = getApplicationAnswers(
              application.answers,
            )
            return hasNotUtilizedRights(hasUtilizedEmployeeSickPayRights)
          },
          maxDate: (application) => {
            const { hasUtilizedEmployeeSickPayRights } = getApplicationAnswers(
              application.answers,
            )
            return hasUtilizedRights(hasUtilizedEmployeeSickPayRights)
          },
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          required: true,
          condition: (answers) => shouldShowEmployeeSickPayEndDate(answers),
        }),
      ],
    }),
  ],
})
