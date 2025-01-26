import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
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
