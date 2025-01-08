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
import { ReasonForApplicationOptions } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'
import { Application } from '@island.is/application/types'

export const startingSchoolSubSection = buildSubSection({
  id: 'startingSchoolSubSection',
  title: newPrimarySchoolMessages.primarySchool.startingSchoolSubSectionTitle,
  condition: (answers) => {
    // Only display section if "Moving abroad" is not selected as reason for application
    const { reasonForApplication } = getApplicationAnswers(answers)
    return reasonForApplication !== ReasonForApplicationOptions.MOVING_ABROAD
  },
  children: [
    buildMultiField({
      id: 'startingSchoolMultiField',
      title: newPrimarySchoolMessages.primarySchool.startingSchoolTitle,
      description:
        newPrimarySchoolMessages.primarySchool.startingSchoolDescription,
      children: [
        buildDateField({
          id: 'startingSchool.startDate',
          title: newPrimarySchoolMessages.shared.date,
          placeholder: newPrimarySchoolMessages.shared.datePlaceholder,
          defaultValue: null,
          minDate: () => new Date(),
        }),
        buildRadioField({
          id: 'startingSchool.temporaryStay',
          title: newPrimarySchoolMessages.primarySchool.temporaryStay,
          condition: (answers) =>
            !!getApplicationAnswers(answers).selectedSchool,
          width: 'half',
          defaultValue: NO,
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
        }),
        buildDescriptionField({
          id: 'endDateDescription',
          titleVariant: 'h4',
          title: newPrimarySchoolMessages.primarySchool.endDateDescription,
        }),
        buildDateField({
          id: 'startingSchool.endDate',
          title: newPrimarySchoolMessages.primarySchool.endDateTitle,
          placeholder: newPrimarySchoolMessages.shared.datePlaceholder,
          defaultValue: null,
          condition: (answers) => {
            const { startDateHiddenInput, startDate, temporaryStay } =
              getApplicationAnswers(answers)
            return temporaryStay === YES && startDate === startDateHiddenInput
          },
          minDate: (application: Application) =>
            new Date(getApplicationAnswers(application.answers).startDate),
        }),
        buildHiddenInputWithWatchedValue({
          // Needed to trigger an update on minimum date for endDate
          id: 'startDate.hiddenInput',
          watchValue: 'startingSchool.startDate',
        }),
      ],
    }),
  ],
})
