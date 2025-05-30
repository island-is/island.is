import {
  buildCheckboxField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  coreMessages,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { education as educationMessages } from '../../../lib/messages'
import { EducationType } from '../../../shared'
import { isCurrentlyStudying } from '../../../utils/educationInformation'

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
          width: 'half',
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
        buildCheckboxField({
          id: 'education.typeOfEducation',
          title: educationMessages.labels.typeOfEducationLabel,
          marginTop: 4,
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
          condition: (answers) =>
            getValueViaPath<string>(answers, 'education.lastTwelveMonths') ===
            YES,
        }),
        buildTextField({
          id: 'education.currentEducation.schoolName',
          title: educationMessages.labels.schoolNameLabel,
          condition: isCurrentlyStudying,
        }),
        buildTextField({
          id: 'education.currentEducation.programName',
          title: educationMessages.labels.schoolProgramLabel,
          width: 'half',
          condition: isCurrentlyStudying,
        }),
        buildTextField({
          id: 'education.currentEducation.programUnits',
          title: educationMessages.labels.schoolProgramUnitsLabel,
          width: 'half',
          condition: isCurrentlyStudying,
        }),
        buildTextField({
          id: 'education.currentEducation.programDegree',
          title: educationMessages.labels.schoolDegreeLabel,
          width: 'half',
          condition: isCurrentlyStudying,
        }),
        buildTextField({
          id: 'education.currentEducation.programEnd',
          title: educationMessages.labels.currentSchoolEndDateLabel,
          width: 'half',
          condition: isCurrentlyStudying,
        }),
        buildDescriptionField({
          id: 'education.currentEducation.description',
          title: educationMessages.labels.currentSchoolDegreeFileLabel,
          titleVariant: 'h5',
          condition: isCurrentlyStudying,
        }),
        buildFileUploadField({
          id: 'education.currentEducation.degreeFile',
          title: educationMessages.labels.currentSchoolDegreeFileNameLabel,
          uploadHeader:
            educationMessages.labels.currentSchoolDegreeFileNameLabel,
          condition: isCurrentlyStudying,
        }),
      ],
    }),
  ],
})
