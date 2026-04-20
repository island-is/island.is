import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { error, userInformation } from '../../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import { ApplicationType } from '../../../shared'
import {
  ApplicationPeriod,
  checkIsActor,
  checkIsFreshman,
  getSchoolsData,
  Routes,
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
          baseInfoReadOnly: true,
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
        buildPhoneField({
          id: 'applicant.phoneNumber',
          title: userInformation.applicant.phone,
          width: 'half',
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
            const allowFreshmanApplication =
              getValueViaPath<ApplicationPeriod>(
                externalData,
                'applicationPeriodInfo.data',
              )?.allowFreshmanApplication || false

            const isFreshmanExternalData =
              getValueViaPath<Student>(externalData, 'studentInfo.data')
                ?.isFreshman || false

            return allowFreshmanApplication && !isFreshmanExternalData
          },
          title: userInformation.applicationType.subtitle,
          titleVariant: 'h5',
          space: 3,
        }),
        // Application type -> Show radio and make user select, if we allow freshman application but are unsure whether user is freshman
        buildRadioField({
          id: 'applicationType.value',
          condition: (_, externalData) => {
            const allowFreshmanApplication =
              getValueViaPath<ApplicationPeriod>(
                externalData,
                'applicationPeriodInfo.data',
              )?.allowFreshmanApplication || false

            const isFreshmanExternalData =
              getValueViaPath<Student>(externalData, 'studentInfo.data')
                ?.isFreshman || false

            return allowFreshmanApplication && !isFreshmanExternalData
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
        // Application type -> Hidden input to set the value if radio is not visible
        buildHiddenInput({
          id: 'applicationType.value',
          condition: (_, externalData) => {
            const allowFreshmanApplication =
              getValueViaPath<ApplicationPeriod>(
                externalData,
                'applicationPeriodInfo.data',
              )?.allowFreshmanApplication || false

            const isFreshmanExternalData =
              getValueViaPath<Student>(externalData, 'studentInfo.data')
                ?.isFreshman || false

            // Set value if either:
            // - freshman applications are allowed and student is definetly freshman
            // - freshman applications are NOT allowed (fallback to GENERAL)
            return !allowFreshmanApplication || isFreshmanExternalData
          },
          defaultValue: (application: Application) => {
            const allowFreshmanApplication =
              getValueViaPath<ApplicationPeriod>(
                application.externalData,
                'applicationPeriodInfo.data',
              )?.allowFreshmanApplication || false

            return allowFreshmanApplication
              ? ApplicationType.FRESHMAN
              : ApplicationType.GENERAL_APPLICATION
          },
        }),

        // Application type -> Display alert when we are unsure whether user is freshman, but he selected the freshman option
        buildAlertMessageField({
          id: 'applicationTypeValueAlertMessage',
          alertType: 'warning',
          message: userInformation.applicationType.alertMessage,
          condition: (answers, externalData) => {
            const allowFreshmanApplication =
              getValueViaPath<ApplicationPeriod>(
                externalData,
                'applicationPeriodInfo.data',
              )?.allowFreshmanApplication || false

            const isFreshmanExternalData =
              getValueViaPath<Student>(externalData, 'studentInfo.data')
                ?.isFreshman || false

            const isFreshmanAnswers = checkIsFreshman(answers)

            return (
              allowFreshmanApplication &&
              !isFreshmanExternalData &&
              isFreshmanAnswers
            )
          },
        }),

        // Validation for whether there are any schools open for admission depending on the application type selected above
        buildCustomField({
          component: 'UpdateExternalDataSchools',
          id: 'updateExternalDataSchools',
        }),
        buildHiddenInput({
          id: 'applicationType.isOpenForAdmissionFreshman',
          condition: (_, externalData) => {
            const schoolIsOpenForAdmission = getSchoolsData(externalData)?.find(
              (x) => x.isOpenForAdmissionFreshman,
            )
            return !!schoolIsOpenForAdmission
          },
          defaultValue: true,
        }),
        buildHiddenInput({
          id: 'applicationType.isOpenForAdmissionGeneral',
          condition: (_, externalData) => {
            const schoolIsOpenForAdmission = getSchoolsData(externalData)?.find(
              (x) => x.isOpenForAdmissionGeneral,
            )
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
