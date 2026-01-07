import {
  buildDateField,
  buildDescriptionField,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import { ApplicationType } from '../../../utils/constants'
import { primarySchoolMessages, sharedMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../utils/newPrimarySchoolUtils'
import { Application } from '@island.is/application/types'
import { shouldShowExpectedEndDate } from '../../../utils/conditionUtils'

export const startingSchoolSubSection = buildSubSection({
  id: 'startingSchoolSubSection',
  title: primarySchoolMessages.startingSchool.subSectionTitle,
  condition: (answers) => {
    // Only display section if application type is "Application for a new primary school"
    const { applicationType } = getApplicationAnswers(answers)
    return applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
  },
  children: [
    buildMultiField({
      id: 'startingSchool',
      title: primarySchoolMessages.startingSchool.title,
      description: primarySchoolMessages.startingSchool.description,
      children: [
        buildDateField({
          id: 'startingSchool.expectedStartDate',
          title: primarySchoolMessages.startingSchool.expectedStartDateTitle,
          placeholder:
            primarySchoolMessages.startingSchool.expectedStartDatePlaceholder,
          defaultValue: null,
          minDate: () => new Date(),
        }),
        // Only show for International schools and special education - behavior school/dept types
        buildRadioField({
          id: 'startingSchool.temporaryStay',
          title: primarySchoolMessages.startingSchool.temporaryStay,
          width: 'half',
          space: 4,
          required: true,
          options: [
            {
              label: sharedMessages.yes,
              value: YES,
            },
            {
              label: sharedMessages.no,
              value: NO,
            },
          ],
          condition: (answers, externalData) => {
            return shouldShowExpectedEndDate(answers, externalData)
          },
        }),
        buildDescriptionField({
          id: 'startingSchool.expectedEndDate.description',
          title:
            primarySchoolMessages.startingSchool.expectedEndDateDescription,
          titleVariant: 'h4',
          space: 4,
          condition: (answers, externalData) => {
            const {
              expectedStartDateHiddenInput,
              expectedStartDate,
              temporaryStay,
            } = getApplicationAnswers(answers)

            return (
              shouldShowExpectedEndDate(answers, externalData) &&
              temporaryStay === YES &&
              expectedStartDate === expectedStartDateHiddenInput
            )
          },
        }),
        buildDateField({
          id: 'startingSchool.expectedEndDate',
          title: primarySchoolMessages.startingSchool.expectedEndDateTitle,
          placeholder:
            primarySchoolMessages.startingSchool.expectedEndDatePlaceholder,
          condition: (answers, externalData) => {
            const {
              expectedStartDateHiddenInput,
              expectedStartDate,
              temporaryStay,
            } = getApplicationAnswers(answers)

            return (
              shouldShowExpectedEndDate(answers, externalData) &&
              temporaryStay === YES &&
              expectedStartDate === expectedStartDateHiddenInput
            )
          },
          minDate: (application: Application) =>
            new Date(
              getApplicationAnswers(application.answers).expectedStartDate ??
                '',
            ),
        }),
        buildHiddenInputWithWatchedValue({
          // Needed to trigger an update on minimum date for expectedEndDate
          id: 'startingSchool.expectedStartDateHiddenInput',
          watchValue: 'startingSchool.expectedStartDate',
        }),
      ],
    }),
  ],
})
