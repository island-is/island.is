import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  NO,
} from '@island.is/application/core'
import {
  ApplicationType,
  OptionsType,
  ReasonForApplicationOptions,
} from '../../../lib/constants'
import { primarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/primarySchoolUtils'

export const reasonForApplicationSubSection = buildSubSection({
  id: 'reasonForApplicationSubSection',
  title:
    primarySchoolMessages.primarySchool.reasonForApplicationSubSectionTitle,
  condition: (answers) => {
    const { applyForNeighbourhoodSchool, applicationType } =
      getApplicationAnswers(answers)
    return (
      applicationType === ApplicationType.PRIMARY_SCHOOL ||
      (applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
        applyForNeighbourhoodSchool === NO)
    )
  },
  children: [
    buildMultiField({
      id: 'reasonForApplication',
      title:
        primarySchoolMessages.primarySchool.reasonForApplicationSubSectionTitle,
      description:
        primarySchoolMessages.primarySchool.reasonForApplicationDescription,
      children: [
        buildCustomField(
          {
            id: 'reasonForApplication.reason',
            title:
              primarySchoolMessages.primarySchool
                .reasonForApplicationSubSectionTitle,
            component: 'FriggOptionsAsyncSelectField',
            dataTestId: 'reason-for-application',
          },
          {
            optionsType: OptionsType.REASON,
            placeholder:
              primarySchoolMessages.primarySchool
                .reasonForApplicationPlaceholder,
          },
        ),
        buildTextField({
          id: 'reasonForApplication.transferOfLegalDomicile.streetAddress',
          title: primarySchoolMessages.shared.address,
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
          title: primarySchoolMessages.shared.postalCode,
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
          title: primarySchoolMessages.shared.alertTitle,
          message:
            primarySchoolMessages.primarySchool.registerNewDomicileAlertMessage,
          doesNotRequireAnswer: true,
          alertType: 'info',
          condition: (answers) => {
            const { reasonForApplication } = getApplicationAnswers(answers)

            return (
              reasonForApplication ===
              ReasonForApplicationOptions.MOVING_MUNICIPALITY
            )
          },
        }),
      ],
    }),
  ],
})
