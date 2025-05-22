import {
  buildAlertMessageField,
  buildCheckboxField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { applicant as applicantMessages } from '../../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import { isOtherAddressChecked } from '../../../utils'

export const applicantInformationSubSection = buildSubSection({
  id: 'applicant',
  title: applicantMessages.personalInformation.sectionTitle,
  children: [
    buildMultiField({
      id: 'applicant',
      title: applicantMessages.personalInformation.pageTitle,
      description: applicantMessages.personalInformation.pageDescription,
      children: [
        ...applicantInformationMultiField({
          emailRequired: true,
          phoneRequired: true,
          phoneEnableCountrySelector: true,
          readOnlyEmailAndPhone: true,
          readOnly: true,
        }).children,
        buildCheckboxField({
          id: 'applicant.otherAddressCheckbox',
          backgroundColor: 'blue',
          large: true,
          spacing: 0,
          options: [
            {
              value: YES,
              label: applicantMessages.labels.otherAddressCheckboxLabel,
            },
          ],
        }),
        buildTextField({
          id: 'applicant.otherAddress',
          title: applicantMessages.labels.address,
          width: 'half',
          required: true,
          condition: isOtherAddressChecked,
        }),
        buildSelectField({
          id: 'applicant.otherPostcode',
          title: applicantMessages.labels.postcode,
          width: 'half',
          required: true,
          options: [
            // TODO: Fetch postal codes from API
            {
              value: '105',
              label: '105 Reykjavík',
            },
          ],
          condition: isOtherAddressChecked,
        }),
        // buildDescriptionField({
        //   id: 'applicant.passwordDescription',
        //   title: applicantMessages.labels.passwordDescription,
        //   titleVariant: 'h5',
        // }),
        buildAlertMessageField({
          id: 'applicant.passwordDescription',
          alertType: 'info',
          doesNotRequireAnswer: true,
          message: applicantMessages.labels.passwordDescription,
          marginBottom: 0,
          marginTop: 4,
        }),
        buildTextField({
          id: 'applicant.password',
          title: applicantMessages.labels.passwordLabel,
          placeholder: 'TODO',
          // defaultValue: (application: Application) => {
          //   const password = getValueViaPath<string>(
          //     application.externalData,
          //     'userProfile.data.password',
          //     '',
          //   )

          //   return password
          // },
        }),
        // buildTextField({
        //   id: 'applicant.serviceOffice',
        //   title: applicantMessages.labels.email,
        //   backgroundColor: 'white',
        //   readOnly: true,
        //   defaultValue: (application: Application) => {
        //     return 'TODO'
        //   },
        // }),
      ],
    }),
  ],
})
