import {
  buildAsyncSelectField,
  buildDateField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { fileUploadSharedProps } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { NOT_APPLICABLE } from '../../../lib/constants'
import {
  getApplicationAnswers,
  getYesNoNotApplicableOptions,
} from '../../../lib/medicalAndRehabilitationPaymentsUtils'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const unionSickPaySubSection = buildSubSection({
  id: 'unionSickPaySubSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.generalInformation
      .unionSickPaySubSectionTitle,

  children: [
    buildMultiField({
      id: 'unionSickPayFromUnion',
      title:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .unionSickPayFromUnionTitle,
      condition: () => {
        // TODO: Here we need to check the data that we are getting from the API to know if we should show this field
        return false
      },
      children: [
        buildTextField({
          id: 'unionSickPay.unionName',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .unionSickPayFromUnionName,
          required: true,
          disabled: true,
          width: 'half',
        }),
        buildDateField({
          id: 'unionSickPay.date',
          title: () => {
            //TODO: Here we need to check the date we are getting from the API to know what title to show
            return medicalAndRehabilitationPaymentsFormMessage
              .generalInformation.unionSickPayFromUnionDidEndDate
            //return medicalAndRehabilitationPaymentsFormMessage.generalInformation.unionSickPayFromUnionDoesEndDate
          },
          required: true,
          disabled: true,
          width: 'half',
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
        }),
      ],
    }),
    buildMultiField({
      id: 'unionSickPay',
      title:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .unionSickPayTitle,
      condition: () => {
        // TODO: Here we need to check the data that we are getting from the API to know if we should show this field
        return true
      },
      children: [
        buildRadioField({
          id: 'unionSickPay.option',
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
          id: 'unionSickPay.doesEndDate.description',
          titleVariant: 'h4',
          space: 4,
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .unionSickPayUnionDescriptionTitle,
          condition: (answers) => {
            const { unionSickPayOption } = getApplicationAnswers(answers)
            return unionSickPayOption !== NOT_APPLICABLE
          },
        }),
        buildAsyncSelectField({
          id: 'unionSickPay.union',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .unionSickPayUnionSelectTitle,
          required: true,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .unionSickPayUnionSelectPlaceholder,
          condition: (answers) => {
            const { unionSickPayOption } = getApplicationAnswers(answers)
            return unionSickPayOption !== NOT_APPLICABLE
          },
          loadOptions: async () => {
            return [
              // TODO: Here we need to get the data from the API
              {
                label: 'VR',
                value: 'vr',
              },
              {
                label: 'FIT',
                value: 'fit',
              },
            ]
          },
        }),
        buildDescriptionField({
          id: 'unionSickPay.date.description',
          titleVariant: 'h4',
          space: 4,
          title: (application) => {
            const { unionSickPayOption } = getApplicationAnswers(
              application.answers,
            )

            if (unionSickPayOption === YES) {
              return medicalAndRehabilitationPaymentsFormMessage
                .generalInformation.unionSickPayDidEndDate
            }

            return medicalAndRehabilitationPaymentsFormMessage
              .generalInformation.unionSickPayDoesEndDate
          },
          condition: (answers) => {
            const { unionSickPayOption } = getApplicationAnswers(answers)
            return unionSickPayOption !== NOT_APPLICABLE
          },
        }),
        buildDateField({
          id: 'unionSickPay.date',
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          required: true,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          condition: (answers) => {
            const { unionSickPayOption } = getApplicationAnswers(answers)
            return unionSickPayOption !== NOT_APPLICABLE
          },
        }),
        buildDescriptionField({
          id: 'unionSickPay.attachment.description',
          titleVariant: 'h4',
          space: 4,
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .unionSickPayAttachment,
          condition: (answers) => {
            const { unionSickPayOption } = getApplicationAnswers(answers)
            return unionSickPayOption === YES
          },
        }),
        buildFileUploadField({
          id: 'unionSickPay.fileupload',
          ...fileUploadSharedProps,
          condition: (answers) => {
            const { unionSickPayOption } = getApplicationAnswers(answers)
            return unionSickPayOption === YES
          },
        }),
      ],
    }),
  ],
})
