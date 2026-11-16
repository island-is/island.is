import {
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { formatPhoneNumber, removeCountryCode } from '@island.is/shared/utils'
import { guardiansMessages, sharedMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'
import { getSelectedChildOtherParent } from '../../utils/speechTherapyWaitingListRegistrationUtils'

export const guardiansSection = buildSection({
  id: 'guardiansSection',
  title: guardiansMessages.sectionTitle,
  condition: (answers) =>
    getApplicationAnswers(answers).waitingListConsent === YES,
  children: [
    buildMultiField({
      id: 'guardians',
      title: guardiansMessages.sectionTitle,
      description: guardiansMessages.description,
      children: [
        buildDescriptionField({
          id: 'guardiansInfo1',
          title: guardiansMessages.guardianInfo,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: 'guardians[0].fullName',
          title: sharedMessages.fullName,
          width: 'half',
          dataTestId: 'fullName1',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData).applicantName,
        }),
        buildTextField({
          id: 'guardians[0].nationalId',
          title: sharedMessages.nationalId,
          width: 'half',
          dataTestId: 'nationalId1',
          format: '######-####',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantNationalId,
        }),
        buildTextField({
          id: 'guardians[0].email',
          title: guardiansMessages.email,
          width: 'half',
          dataTestId: 'email1',
          variant: 'email',
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .userProfileEmail,
        }),
        buildPhoneField({
          id: 'guardians[0].phoneNumber',
          title: guardiansMessages.phoneNumber,
          width: 'half',
          dataTestId: 'phone1',
          placeholder: '000-0000',
          enableCountrySelector: true,
          defaultValue: (application: Application) => {
            const { userProfilePhoneNumber } = getApplicationExternalData(
              application.externalData,
            )

            return formatPhoneNumber(
              removeCountryCode(userProfilePhoneNumber ?? ''),
            )
          },
        }),

        buildDescriptionField({
          id: 'guardiansInfo2',
          title: guardiansMessages.guardianInfo,
          titleVariant: 'h4',
          marginTop: 2,
          condition: (answers, externalData) =>
            !!getSelectedChildOtherParent(answers, externalData),
        }),
        buildTextField({
          id: 'guardians[1].fullName',
          title: sharedMessages.fullName,
          width: 'half',
          dataTestId: 'fullName2',
          disabled: true,
          condition: (answers, externalData) =>
            !!getSelectedChildOtherParent(answers, externalData),
          defaultValue: (application: Application) =>
            getSelectedChildOtherParent(
              application.answers,
              application.externalData,
            )?.fullName,
        }),
        buildTextField({
          id: 'guardians[1].nationalId',
          title: sharedMessages.nationalId,
          width: 'half',
          dataTestId: 'nationalId2',
          format: '######-####',
          disabled: true,
          condition: (answers, externalData) =>
            !!getSelectedChildOtherParent(answers, externalData),
          defaultValue: (application: Application) =>
            getSelectedChildOtherParent(
              application.answers,
              application.externalData,
            )?.nationalId,
        }),
        buildTextField({
          id: 'guardians[1].email',
          title: guardiansMessages.email,
          width: 'half',
          dataTestId: 'email2',
          variant: 'email',
          condition: (answers, externalData) =>
            !!getSelectedChildOtherParent(answers, externalData),
        }),
        buildPhoneField({
          id: 'guardians[1].phoneNumber',
          title: guardiansMessages.phoneNumber,
          width: 'half',
          dataTestId: 'phone2',
          placeholder: '000-0000',
          enableCountrySelector: true,
          condition: (answers, externalData) =>
            !!getSelectedChildOtherParent(answers, externalData),
        }),
      ],
    }),
  ],
})
