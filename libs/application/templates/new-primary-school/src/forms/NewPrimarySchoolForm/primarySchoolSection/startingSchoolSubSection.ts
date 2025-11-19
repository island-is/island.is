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
import { ApplicationType, OrganizationSubType } from '../../../utils/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getSelectedSchoolSubType,
} from '../../../utils/newPrimarySchoolUtils'
import { Application } from '@island.is/application/types'

export const startingSchoolSubSection = buildSubSection({
  id: 'startingSchoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.startingSchoolSubSectionTitle,
  condition: (answers) => {
    // Only display section if application type is "Application for a new primary school"
    const { applicationType } = getApplicationAnswers(answers)
    return applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
  },
  children: [
    buildMultiField({
      id: 'startingSchool',
      title: newPrimarySchoolMessages.primarySchool.startingSchoolTitle,
      description:
        newPrimarySchoolMessages.primarySchool.startingSchoolDescription,
      children: [
        buildDateField({
          id: 'startingSchool.expectedStartDate',
          title: newPrimarySchoolMessages.shared.date,
          placeholder: newPrimarySchoolMessages.shared.datePlaceholder,
          defaultValue: null,
          minDate: () => new Date(),
        }),
        // Only show for International school types
        buildRadioField({
          id: 'startingSchool.temporaryStay',
          title: newPrimarySchoolMessages.primarySchool.temporaryStay,
          width: 'half',
          space: 4,
          required: true,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              value: NO,
            },
          ],
          condition: (answers, externalData) => {
            return (
              getSelectedSchoolSubType(answers, externalData) ===
              OrganizationSubType.INTERNATIONAL_SCHOOL
            )
          },
        }),
        buildDescriptionField({
          id: 'startingSchool.expectedEndDate.description',
          title:
            newPrimarySchoolMessages.primarySchool.expectedEndDateDescription,
          titleVariant: 'h4',
          space: 4,
          condition: (answers, externalData) => {
            const {
              expectedStartDateHiddenInput,
              expectedStartDate,
              temporaryStay,
            } = getApplicationAnswers(answers)
            return (
              getSelectedSchoolSubType(answers, externalData) ===
                OrganizationSubType.INTERNATIONAL_SCHOOL &&
              temporaryStay === YES &&
              expectedStartDate === expectedStartDateHiddenInput
            )
          },
        }),
        buildDateField({
          id: 'startingSchool.expectedEndDate',
          title: newPrimarySchoolMessages.primarySchool.expectedEndDateTitle,
          placeholder: newPrimarySchoolMessages.shared.datePlaceholder,
          condition: (answers, externalData) => {
            const {
              expectedStartDateHiddenInput,
              expectedStartDate,
              temporaryStay,
            } = getApplicationAnswers(answers)
            return (
              getSelectedSchoolSubType(answers, externalData) ===
                OrganizationSubType.INTERNATIONAL_SCHOOL &&
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
