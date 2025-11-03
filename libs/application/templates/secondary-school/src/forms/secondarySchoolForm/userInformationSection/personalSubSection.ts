import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import { checkIsActor, Routes } from '../../../utils'
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
      ],
    }),
  ],
})
