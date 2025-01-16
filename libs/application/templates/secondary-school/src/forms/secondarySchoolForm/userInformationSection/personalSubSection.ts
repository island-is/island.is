import {
  buildAlertMessageField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import { ApplicationType, Routes, Student } from '../../../utils'

export const personalSubSection = buildSubSection({
  id: 'personalSubSection',
  title: userInformation.applicant.subSectionTitle,
  children: [
    buildMultiField({
      id: Routes.PERSONAL,
      title: userInformation.applicant.pageTitle,
      description: userInformation.applicant.description,
      children: [
        buildDescriptionField({
          id: 'applicantInfo.subtitle',
          title: userInformation.applicant.subtitle,
          titleVariant: 'h5',
        }),
        ...applicantInformationMultiField({
          emailRequired: true,
          phoneRequired: true,
          readOnly: true,
        }).children,
        buildDescriptionField({
          id: 'applicationTypeInfo.subtitle',
          condition: (_, externalData) => {
            const studentInfo = getValueViaPath<Student>(
              externalData,
              'studentInfo.data',
            )
            return !studentInfo?.isFreshman
          },
          title: userInformation.applicationType.subtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          id: 'applicationType.value',
          condition: (_, externalData) => {
            const studentInfo = getValueViaPath<Student>(
              externalData,
              'studentInfo.data',
            )
            return !studentInfo?.isFreshman
          },
          options: [
            {
              value: ApplicationType.FRESHMAN,
              label: userInformation.applicationType.freshmanOptionTitle,
            },
            {
              value: ApplicationType.GENERAL_APPLICATION,
              label:
                userInformation.applicationType.generalApplicationOptionTitle,
            },
          ],
          width: 'full',
        }),
        buildHiddenInput({
          id: 'applicationType.value',
          condition: (_, externalData) => {
            const studentInfo = getValueViaPath<Student>(
              externalData,
              'studentInfo.data',
            )
            return !!studentInfo?.isFreshman
          },
          defaultValue: ApplicationType.FRESHMAN,
        }),
        buildAlertMessageField({
          id: 'applicationTypeAlertMessage',
          alertType: 'warning',
          message: userInformation.applicationType.alertMessage,
          condition: (answers, externalData) => {
            const isFreshmanAnswers =
              getValueViaPath<ApplicationType>(
                answers,
                'applicationType.value',
              ) === ApplicationType.FRESHMAN

            const isFreshmanExternalData = getValueViaPath<Student>(
              externalData,
              'studentInfo.data',
            )?.isFreshman

            return isFreshmanAnswers && !isFreshmanExternalData
          },
        }),
      ],
    }),
  ],
})
