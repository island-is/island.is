import {
  buildAlertMessageField,
  buildCheckboxField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { GaldurDomainModelsSettingsPostcodesPostcodeDTO } from '@island.is/clients/vmst-unemployment'
import { applicant as applicantMessages } from '../../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import { isOtherAddressChecked } from '../../../utils'
import { Application } from '@island.is/application/types'

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
          emailAndPhoneReadOnly: true,
          baseInfoReadOnly: true,
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
          options: (application) => {
            const nameAndPostcode = getValueViaPath<
              GaldurDomainModelsSettingsPostcodesPostcodeDTO[]
            >(
              application.externalData,
              'unemploymentApplication.data.supportData.postCodes',
            )
            return (
              nameAndPostcode
                ?.filter(
                  ({ nameAndCode }) => nameAndCode && nameAndCode.length > 0,
                )
                .map(({ nameAndCode, id }) => {
                  return {
                    label: nameAndCode ?? '',
                    value: id || '',
                  }
                }) ?? []
            )
          },
          condition: isOtherAddressChecked,
        }),
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
          placeholder: applicantMessages.labels.passwordPlaceholder,
          required: true,
          maxLength: 10,
          minLength: 4,
          defaultValue: (application: Application) => {
            return (
              getValueViaPath<string>(
                application.externalData,
                'unemploymentApplication.data.personalInformation.passCode',
              ) ?? ''
            )
          },
        }),
      ],
    }),
  ],
})
