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
import { Application } from '@island.is/application/types'
import { applicant } from '../../../lib/messages'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import { GaldurDomainModelsSettingsPostcodesPostcodeDTO } from '@island.is/clients/vmst-unemployment'
import { isSamePlaceOfResidenceChecked } from '../../../utils'

export const applicantSubSection = buildSubSection({
  id: 'applicantSubSection',
  title: applicant.general.pageTitle,
  children: [
    buildMultiField({
      id: 'applicantMultiField',
      title: applicant.general.pageTitle,
      description: applicant.general.description,
      children: [
        ...applicantInformationMultiField({
          emailRequired: true,
          phoneRequired: true,
          phoneEnableCountrySelector: true,
          baseInfoReadOnly: true,
          emailAndPhoneReadOnly: true,
        }).children,
        buildCheckboxField({
          id: 'applicant.isSamePlaceOfResidence',
          backgroundColor: 'blue',
          large: true,
          spacing: 0,
          options: [
            {
              value: YES,
              label: applicant.labels.checkboxLabel,
            },
          ],
          clearOnChange: [
            'applicant.other.address',
            'applicant.other.postalCode',
          ],
        }),
        buildTextField({
          id: 'applicant.other.address',
          title: applicant.labels.address,
          width: 'half',
          required: true,
          condition: isSamePlaceOfResidenceChecked,
        }),
        buildSelectField({
          id: 'applicant.other.postalCode',
          title: applicant.labels.postalCode,
          width: 'half',
          required: true,
          options: (application) => {
            const nameAndPostcode = getValueViaPath<
              GaldurDomainModelsSettingsPostcodesPostcodeDTO[]
            >(
              application.externalData,
              'activityGrantApplication.data.activationGrant.supportData.postCodes',
            )

            return (
              nameAndPostcode
                ?.filter(
                  ({ nameAndCode }) => nameAndCode && nameAndCode.length > 0,
                )
                .map(({ nameAndCode }) => {
                  return {
                    label: nameAndCode ?? '',
                    value: nameAndCode ?? '',
                  }
                }) ?? []
            )
          },
          condition: isSamePlaceOfResidenceChecked,
        }),
        buildAlertMessageField({
          id: 'applicant.passwordDescription',
          alertType: 'info',
          doesNotRequireAnswer: true,
          message: applicant.labels.passwordMessage,
          marginBottom: 0,
          marginTop: 4,
        }),
        buildTextField({
          id: 'applicant.password',
          title: applicant.labels.password,
          placeholder: applicant.labels.passwordPlaceholder,
          required: true,
          maxLength: 10,
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
