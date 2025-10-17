import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  NO,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  ApplicationType,
  OptionsType,
  ReasonForApplicationOptions,
  SchoolType,
} from '../../../utils/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../utils/newPrimarySchoolUtils'

export const reasonForApplicationSubSection = buildSubSection({
  id: 'reasonForApplicationSubSection',
  title:
    newPrimarySchoolMessages.primarySchool.reasonForApplicationSubSectionTitle,
  condition: (answers) => {
    const { applyForPreferredSchool, applicationType } =
      getApplicationAnswers(answers)
    return (
      applicationType === ApplicationType.NEW_PRIMARY_SCHOOL ||
      (applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
        applyForPreferredSchool === NO)
    )
  },
  children: [
    buildMultiField({
      id: 'reasonForApplication',
      title:
        newPrimarySchoolMessages.primarySchool
          .reasonForApplicationSubSectionTitle,
      description: (application) => {
        const { applicationType, selectedSchoolType } = getApplicationAnswers(
          application.answers,
        )

        if (
          applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
          selectedSchoolType === SchoolType.PUBLIC_SCHOOL
        ) {
          return newPrimarySchoolMessages.primarySchool
            .reasonForApplicationEnrollmentDescription
        } else {
          return newPrimarySchoolMessages.primarySchool
            .reasonForApplicationDescription
        }
      },
      children: [
        buildCustomField(
          {
            id: 'reasonForApplication.reason',
            title:
              newPrimarySchoolMessages.primarySchool
                .reasonForApplicationSubSectionTitle,
            component: 'FriggOptionsAsyncSelectField',
          },
          {
            optionsType: (application: Application) => {
              const { selectedSchoolType } = getApplicationAnswers(
                application.answers,
              )

              return selectedSchoolType === SchoolType.PRIVATE_SCHOOL
                ? OptionsType.REASON_PRIVATE_SCHOOL
                : selectedSchoolType === SchoolType.INTERNATIONAL_SCHOOL
                ? OptionsType.REASON_INTERNATIONAL_SCHOOL
                : OptionsType.REASON
            },
            placeholder:
              newPrimarySchoolMessages.primarySchool
                .reasonForApplicationPlaceholder,
            useIdAndKey: true,
          },
        ),
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
