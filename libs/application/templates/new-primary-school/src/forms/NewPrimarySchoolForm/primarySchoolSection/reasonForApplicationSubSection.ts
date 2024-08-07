import {
  buildAlertMessageField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { getAllCountryCodes } from '@island.is/shared/utils'
import { ReasonForApplicationOptions } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getReasonForApplicationOptions,
} from '../../../lib/newPrimarySchoolUtils'

export const reasonForApplicationSubSection = buildSubSection({
  id: 'reasonForApplicationSubSection',
  title:
    newPrimarySchoolMessages.primarySchool.reasonForApplicationSubSectionTitle,
  children: [
    buildMultiField({
      id: 'reasonForApplication',
      title:
        newPrimarySchoolMessages.primarySchool
          .reasonForApplicationSubSectionTitle,
      description:
        newPrimarySchoolMessages.primarySchool.reasonForApplicationDescription,
      children: [
        buildSelectField({
          id: 'reasonForApplication.reason',
          dataTestId: 'reason-for-application',
          title:
            newPrimarySchoolMessages.primarySchool
              .reasonForApplicationSubSectionTitle,
          placeholder:
            newPrimarySchoolMessages.primarySchool
              .reasonForApplicationPlaceholder,
          options: getReasonForApplicationOptions(),
        }),
        buildSelectField({
          id: 'reasonForApplication.movingAbroad.country',
          dataTestId: 'reason-for-application-country',
          title: newPrimarySchoolMessages.primarySchool.country,
          placeholder:
            newPrimarySchoolMessages.primarySchool.countryPlaceholder,
          options: () => {
            const countries = getAllCountryCodes()
            return countries.map((country) => {
              return {
                label: country.name_is || country.name,
                value: country.code,
              }
            })
          },
          condition: (answers) => {
            const { reasonForApplication } = getApplicationAnswers(answers)

            return (
              reasonForApplication === ReasonForApplicationOptions.MOVING_ABROAD
            )
          },
        }),
        buildTextField({
          id: 'reasonForApplication.transferOfLegalDomicile.streetAddress',
          title: newPrimarySchoolMessages.shared.address,
          width: 'half',
          required: true,
          condition: (answers) => {
            const { reasonForApplication } = getApplicationAnswers(answers)

            return (
              reasonForApplication ===
              ReasonForApplicationOptions.TRANSFER_OF_LEGAL_DOMICILE
            )
          },
        }),
        buildTextField({
          id: 'reasonForApplication.transferOfLegalDomicile.postalCode',
          title: newPrimarySchoolMessages.shared.postalCode,
          width: 'half',
          required: true,
          format: '###',
          condition: (answers) => {
            const { reasonForApplication } = getApplicationAnswers(answers)

            return (
              reasonForApplication ===
              ReasonForApplicationOptions.TRANSFER_OF_LEGAL_DOMICILE
            )
          },
        }),
        buildAlertMessageField({
          id: 'reasonForApplication.info',
          title: newPrimarySchoolMessages.shared.alertTitle,
          message:
            newPrimarySchoolMessages.primarySchool
              .registerNewDomicileAlertMessage,
          doesNotRequireAnswer: true,
          alertType: 'info',
          condition: (answers) => {
            const { reasonForApplication, reasonForApplicationCountry } =
              getApplicationAnswers(answers)

            return (
              reasonForApplication ===
                ReasonForApplicationOptions.TRANSFER_OF_LEGAL_DOMICILE ||
              (reasonForApplication ===
                ReasonForApplicationOptions.MOVING_ABROAD &&
                reasonForApplicationCountry !== undefined)
            )
          },
        }),
      ],
    }),
  ],
})
