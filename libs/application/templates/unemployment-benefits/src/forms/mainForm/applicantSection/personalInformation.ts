import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { applicant as applicantMessages } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'

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
        buildDescriptionField({
          id: 'applicant.passwordDescription',
          title: applicantMessages.labels.passwordDescription,
          titleVariant: 'h5',
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
        buildCheckboxField({
          id: 'applicant.otherAddressCheckbox',
          backgroundColor: 'blue',
          large: true,
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
          condition: (answers, _) => {
            const isOtherAddressChecked = getValueViaPath<string>(
              answers,
              'applicant.otherAddressCheckbox',
              '',
            )

            return isOtherAddressChecked
              ? isOtherAddressChecked[0] === YES
              : false
          },
        }),
        buildTextField({
          id: 'applicant.otherPostcode',
          title: applicantMessages.labels.postcode,
          width: 'half',
          required: true,
          condition: (answers, _) => {
            const isOtherAddressChecked = getValueViaPath<string>(
              answers,
              'applicant.otherAddressCheckbox',
              '',
            )
            return isOtherAddressChecked
              ? isOtherAddressChecked[0] === YES
              : false
          },
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
