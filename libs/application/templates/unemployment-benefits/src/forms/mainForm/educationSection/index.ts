import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  coreMessages,
  NO,
  YES,
} from '@island.is/application/core'
import { education as educationMessages } from '../../../lib/messages'
import { EducationType } from '../../../shared'
import {
  showAppliedForNextSemester,
  wasStudyingLastTwelveMonths,
} from '../../../utils/educationInformation'

export const educationSection = buildSection({
  id: 'educationSection',
  title: educationMessages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'educationSection',
      title: educationMessages.general.pageTitle,
      description: educationMessages.general.pageDescription,
      children: [
        buildDescriptionField({
          id: 'education.lastTwelveMonthsDescription',
          title: educationMessages.labels.lastTvelveMonthsLabel,
          titleVariant: 'h5',
        }),
        buildRadioField({
          id: 'education.lastTwelveMonths',
          width: 'half',
          space: 0,
          required: true,
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
        }),
        buildDescriptionField({
          id: 'education.typeOfEducationDescription',
          title: educationMessages.labels.typeOfEducationLabel,
          marginTop: 2,
          titleVariant: 'h5',
          condition: wasStudyingLastTwelveMonths,
        }),
        buildCheckboxField({
          id: 'education.typeOfEducation',
          required: true,
          options: [
            {
              value: EducationType.CURRENT,
              label: educationMessages.labels.currentlyEducationLabel,
            },
            {
              value: EducationType.LAST_SEMESTER,
              label: educationMessages.labels.lastSemesterEducationLabel,
            },
            {
              value: EducationType.LAST_YEAR,
              label: educationMessages.labels.lastTvelveMonthsEducationLabel,
            },
          ],
          condition: wasStudyingLastTwelveMonths,
        }),
        buildDescriptionField({
          id: 'education.lastSemester.appliedForNextSemesterDescription',
          title: educationMessages.labels.appliedForNextSemesterQuestion,
          titleVariant: 'h5',
          marginTop: 2,
          condition: showAppliedForNextSemester,
        }),
        buildRadioField({
          id: 'education.appliedForNextSemester',
          width: 'half',
          space: 0,
          required: true,
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
          condition: showAppliedForNextSemester,
        }),
      ],
    }),
  ],
})
