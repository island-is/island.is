import {
  buildAlertMessageField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { error, userInformation } from '../../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import {
  ApplicationType,
  checkIsActor,
  checkIsFreshman,
  Routes,
  SecondarySchool,
  Student,
} from '../../../utils'
import { Application, UserProfile } from '@island.is/application/types'

export const personalSubSection = buildSubSection({
  id: 'personalSubSection',
  title: userInformation.applicant.subSectionTitle,
  children: [
    buildMultiField({
      id: Routes.PERSONAL,
      title: userInformation.applicant.pageTitle,
      description: userInformation.applicant.description,
      children: [
        // Applicant info
        buildDescriptionField({
          id: 'applicantInfo.subtitle',
          title: userInformation.applicant.subtitle,
          titleVariant: 'h5',
        }),
        ...applicantInformationMultiField({
          emailRequired: true,
          phoneRequired: true,
          phoneEnableCountrySelector: true,
          emailCondition: (_1, _2, user) => {
            return checkIsActor(user)
          },
          phoneCondition: (_1, _2, user) => {
            return checkIsActor(user)
          },
          readOnly: true,
        }).children,
        buildTextField({
          id: 'applicant.email',
          title: userInformation.applicant.email,
          width: 'half',
          variant: 'email',
          condition: (_1, _2, user) => {
            return !checkIsActor(user)
          },
          readOnly: true,
          defaultValue: (application: Application) => {
            const userProfile = getValueViaPath<UserProfile>(
              application.externalData,
              'userProfile.data',
            )
            return userProfile?.email
          },
        }),
        buildTextField({
          id: 'applicant.phoneNumber',
          title: userInformation.applicant.phone,
          width: 'half',
          variant: 'tel',
          format: '###-####',
          condition: (_1, _2, user) => {
            return !checkIsActor(user)
          },
          readOnly: true,
          defaultValue: (application: Application) => {
            const userProfile = getValueViaPath<UserProfile>(
              application.externalData,
              'userProfile.data',
            )
            return userProfile?.mobilePhoneNumber
          },
        }),
        buildAlertMessageField({
          id: 'applicationInfoEmailPhoneAlertMessage',
          title: '',
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: (_1, _2, user) => {
            return !checkIsActor(user)
          },
          message: userInformation.applicant.alertMessage,
          links: [
            {
              title: userInformation.applicant.alertMessageLinkTitle,
              url: userInformation.applicant.alertMessageLink,
              isExternal: false,
            },
          ],
        }),

        // Application type (Fresman vs General)
        buildDescriptionField({
          id: 'applicationTypeInfo.subtitle',
          condition: (_, externalData) => {
            const isFreshmanExternalData = getValueViaPath<Student>(
              externalData,
              'studentInfo.data',
            )?.isFreshman
            return !isFreshmanExternalData
          },
          title: userInformation.applicationType.subtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        buildRadioField({
          id: 'applicationType.value',
          condition: (_, externalData) => {
            const isFreshmanExternalData = getValueViaPath<Student>(
              externalData,
              'studentInfo.data',
            )?.isFreshman
            return !isFreshmanExternalData
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
            const isFreshmanExternalData = getValueViaPath<Student>(
              externalData,
              'studentInfo.data',
            )?.isFreshman

            return !!isFreshmanExternalData
          },
          defaultValue: ApplicationType.FRESHMAN,
        }),
        buildAlertMessageField({
          id: 'applicationTypeValueAlertMessage',
          alertType: 'warning',
          message: userInformation.applicationType.alertMessage,
          condition: (answers, externalData) => {
            const isFreshmanExternalData = getValueViaPath<Student>(
              externalData,
              'studentInfo.data',
            )?.isFreshman
            const isFreshmanAnswers = checkIsFreshman(answers)
            return !isFreshmanExternalData && isFreshmanAnswers
          },
        }),

        // Validation for whether there are any schools open for admission depending on the application type selected above
        buildHiddenInput({
          id: 'applicationType.isOpenForAdmissionFreshman',
          condition: (_, externalData) => {
            const schoolIsOpenForAdmission = getValueViaPath<SecondarySchool[]>(
              externalData,
              'schools.data',
            )?.find((x) => x.isOpenForAdmissionFreshman)
            return !!schoolIsOpenForAdmission
          },
          defaultValue: true,
        }),
        buildHiddenInput({
          id: 'applicationType.isOpenForAdmissionGeneral',
          condition: (_, externalData) => {
            const schoolIsOpenForAdmission = getValueViaPath<SecondarySchool[]>(
              externalData,
              'schools.data',
            )?.find((x) => x.isOpenForAdmissionGeneral)
            return !!schoolIsOpenForAdmission
          },
          defaultValue: true,
        }),
        buildAlertMessageField({
          id: 'applicationTypeIsOpenForAdmissionAlertMessage',
          alertType: 'error',
          title: error.errorNoSchoolOpenForAdmissionTitle,
          message: error.errorNoSchoolOpenForAdmissionDescription,
          condition: (answers) => {
            const applicationType = getValueViaPath<ApplicationType>(
              answers,
              'applicationType.value',
            )
            if (!applicationType) return false

            let isOpenForAdmission: boolean | undefined
            if (checkIsFreshman(answers)) {
              isOpenForAdmission = getValueViaPath<boolean>(
                answers,
                'applicationType.isOpenForAdmissionFreshman',
              )
            } else {
              isOpenForAdmission = getValueViaPath<boolean>(
                answers,
                'applicationType.isOpenForAdmissionGeneral',
              )
            }

            return !isOpenForAdmission
          },
        }),
      ],
    }),
  ],
})
