import {
  buildCheckboxField,
  buildMultiField,
  buildRadioField,
  buildSection,
  NO,
  YES,
} from '@island.is/application/core'
import { education as educationMessages } from '../../../lib/messages'
import { EducationType } from '../../../shared'

export const educationSection = buildSection({
  id: 'educationSection',
  title: educationMessages.general.sectionTitle,
  children: [
    buildMultiField({
      title: educationMessages.general.pageTitle,
      description: educationMessages.general.pageDescription,
      children: [
        buildRadioField({
          id: 'education.lastTwelveMonths',
          title: educationMessages.labels.lastTvelveMonthsLabel,
          options: [
            {
              value: YES,
              label: educationMessages.labels.currentlyEducationLabel,
            },
            {
              value: NO,
              label: educationMessages.labels.lastSemesterEducationLabel,
            },
          ],
        }),
        buildCheckboxField({
          id: 'education.typeOfEducation',
          title: educationMessages.labels.typeOfEducationLabel,
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
        }),
      ],
    }),
  ],
})
