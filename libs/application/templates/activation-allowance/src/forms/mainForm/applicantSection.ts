import {
  buildAlertMessageField,
  buildCheckboxField,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildSelectField,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { applicant } from '../../lib/messages'
import { isSamePlaceOfResidence } from '../../utils'

export const applicantSection = buildSection({
  id: 'applicantSection',
  title: applicant.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'applicantMultiField',
      title: applicant.general.pageTitle,
      description: applicant.general.description,
      children: [
        buildTextField({
          id: 'applicant.name',
          title: applicant.labels.name,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath(application.externalData, 'identity.data.name') ??
            '',
        }),
        buildTextField({
          id: 'applicant.nationalId',
          title: applicant.labels.nationalId,
          format: '######-####',
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'identity.data.nationalId',
            ) ?? '',
        }),
        buildTextField({
          id: 'applicant.address',
          title: applicant.labels.address,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'identity.data.address.streetAddress',
            ) ?? '',
        }),
        buildTextField({
          id: 'applicant.nationalAddress',
          title: applicant.labels.nationalAddress,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: 'Íslensk', // TODO: Fetch national address from API
        }),
        buildTextField({
          id: 'applicant.postalCode',
          title: applicant.labels.postalCode,
          width: 'half',
          format: '###',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) => {
            return (
              getValueViaPath(
                application.externalData,
                'identity.data.address.postalCode',
              ) ?? '105'
            )
          },
        }),
        buildTextField({
          id: 'applicant.city',
          title: applicant.labels.city,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'identity.data.address.city',
            ) ?? '',
        }),
        buildTextField({
          id: 'applicant.email',
          title: applicant.labels.email,
          width: 'half',
          variant: 'email',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'userProfile.data.email',
            ) ?? '',
          maxLength: 100,
        }),
        buildPhoneField({
          id: 'applicant.phoneNumber',
          title: applicant.labels.tel,
          width: 'half',
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
            ) ?? '',
        }),
        buildAlertMessageField({
          id: 'applicationInfoEmailPhoneAlertMessage',
          title: '',
          alertType: 'info',
          doesNotRequireAnswer: true,
          message: applicant.labels.alertMessage,
          links: [
            {
              title: applicant.labels.alertMessageLinkTitle,
              url: applicant.labels.alertMessageLink,
              isExternal: false,
            },
          ],
        }),
        buildCheckboxField({
          id: 'applicant.isSamePlaceOfResidence',
          backgroundColor: 'blue',
          spacing: 0,
          options: [
            {
              value: YES,
              label: applicant.labels.checkboxLabel,
            },
          ],
        }),
        buildTextField({
          id: 'applicant.other.address',
          title: applicant.labels.address,
          width: 'half',
          required: true,
          condition: isSamePlaceOfResidence,
        }),
        buildSelectField({
          id: 'applicant.other.postalCode',
          title: applicant.labels.postalCode,
          width: 'half',
          required: true,
          options: [
            // TODO: Fetch postal codes from API
            {
              value: '105',
              label: '105 Reykjavík',
            },
          ],
          condition: isSamePlaceOfResidence,
        }),
        buildAlertMessageField({
          id: 'applicant.other.passwordAlertMessage',
          alertType: 'info',
          doesNotRequireAnswer: true,
          message: applicant.labels.passwordMessage,
          marginBottom: 0,
        }),
        buildTextField({
          id: 'applicant.password',
          title: applicant.labels.password,
          placeholder: applicant.labels.passwordPlaceholder,
          width: 'half',
          required: true,
        }),
      ],
    }),
  ],
})
