import {
  buildAlertMessageField,
  buildHiddenInput,
  buildHiddenInputWithWatchedValue,
  buildLinkField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'

import { personal as personalMessages } from '../../../lib/messages'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { isCompanyType, isPersonType } from '../../../utils'
import { RegisterNumber } from '../../../shared/types'

export const personalInformationSection = buildSection({
  id: 'personalInformation',
  title: personalMessages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'personalInformationMultiField',
      title: personalMessages.general.pageTitle,
      description: personalMessages.general.pageDescription,
      children: [
        buildTextField({
          id: 'applicant.nationalId',
          title: personalMessages.labels.userNationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) => {
            const nationalIdPath = isCompanyType(application.externalData)
              ? 'identity.data.actor.nationalId'
              : 'identity.data.nationalId'
            const nationalId = getValueViaPath<string>(
              application.externalData,
              nationalIdPath,
            )

            return nationalId
          },
        }),
        buildTextField({
          id: 'applicant.name',
          title: personalMessages.labels.userName,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const { externalData } = application
            const namePath = isCompanyType(externalData)
              ? 'identity.data.actor.name'
              : 'identity.data.name'
            const name = getValueViaPath<string>(externalData, namePath)

            return name
          },
        }),
        buildTextField({
          id: 'applicant.email',
          title: personalMessages.labels.userEmail,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const email = getValueViaPath<string>(
              application.externalData,
              'userProfile.data.email',
              '',
            )

            return email
          },
        }),
        buildTextField({
          id: 'applicant.phoneNumber',
          title: personalMessages.labels.userPhoneNumber,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const phone = getValueViaPath<string>(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
              '',
            )

            return phone
          },
        }),
        buildLinkField({
          id: 'paymentArrangement.individualInfo.changeInfo',
          title: personalMessages.labels.changeInfo,
          link: '/minarsidur/min-gogn/stillingar/',
          variant: 'text',
          iconProps: { icon: 'arrowForward' },
          justifyContent: 'flexEnd',
        }),
        buildRadioField({
          id: 'applicant.registerManyQuestion',
          title: personalMessages.labels.isApplyinForOthers,
          width: 'half',
          required: true,
          condition: (_, externalData) => {
            return isPersonType(externalData)
          },
          options: [
            {
              value: RegisterNumber.one,
              label: personalMessages.labels.isApplyinForOthersRadioNo,
            },
            {
              value: RegisterNumber.many,
              label: personalMessages.labels.isApplyinForOthersRadioYes,
            },
          ],
        }),
        buildHiddenInput({
          id: 'personalValidation.canRegister',
          defaultValue: (application: Application) => {
            const canRegister = getValueViaPath<boolean>(
              application.externalData,
              'individualValidity.data.mayTakeCourse',
              true,
            )

            return canRegister
          },
        }),
        buildHiddenInputWithWatchedValue({
          id: 'personalValidation.registerMany',
          watchValue: 'applicant.registerManyQuestion',
          valueModifier: (value: unknown) => value === RegisterNumber.many,
        }),
        buildAlertMessageField({
          id: 'applicant.personalValidationAlert',
          alertType: 'error',
          message: (application) => {
            const error = getValueViaPath<string>(
              application.externalData,
              'individualValidity.data.errorMessage',
              '',
            )
            return error
          },
          condition: (answers: FormValue, externalData: ExternalData) => {
            const registerMany = getValueViaPath<RegisterNumber>(
              answers,
              'applicant.registerManyQuestion',
            )
            const canRegister = getValueViaPath<boolean>(
              externalData,
              'individualValidity.data.mayTakeCourse',
              true,
            )
            return !canRegister && registerMany === RegisterNumber.one
          },
        }),
      ],
    }),
  ],
})
