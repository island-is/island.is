import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { getAllCountryCodes } from '@island.is/shared/utils'
import {
  OptionsType,
  ReasonForApplicationOptions,
} from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'

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
        buildCustomField(
          {
            id: 'reasonForApplication.reason',
            title:
              newPrimarySchoolMessages.primarySchool
                .reasonForApplicationSubSectionTitle,
            component: 'FriggOptionsAsyncSelectField',
            dataTestId: 'reason-for-application',
          },
          {
            optionsType: OptionsType.REASON,
            placeholder:
              newPrimarySchoolMessages.primarySchool
                .reasonForApplicationPlaceholder,
          },
        ),
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
              ReasonForApplicationOptions.MOVING_MUNICIPALITY
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
              ReasonForApplicationOptions.MOVING_MUNICIPALITY
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
                ReasonForApplicationOptions.MOVING_MUNICIPALITY ||
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
