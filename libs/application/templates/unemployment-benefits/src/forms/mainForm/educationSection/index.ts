import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDateField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildTextField,
  coreMessages,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { education as educationMessages } from '../../../lib/messages'
import { EducationType } from '../../../shared'
import {
  appliedForNextSemester,
  didYouFinishLastSemester,
  isCurrentlyStudying,
  wasStudyingInTheLastYear,
  wasStudyingLastSemester,
  wasStudyingLastTwelveMonths,
} from '../../../utils/educationInformation'
import { GaldurDomainModelsEducationItem } from '@island.is/clients/vmst-unemployment'

export const educationSection = buildSection({
  id: 'educationSection',
  title: educationMessages.general.sectionTitle,
  children: [
    buildMultiField({
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
          doesNotRequireAnswer: true,
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
        buildRadioField({
          id: 'education.typeOfEducation',
          space: 0,
          doesNotRequireAnswer: true,
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
          id: 'education.lastSemester.didYouFinishDescription',
          title: educationMessages.labels.lastSemesterQuestion,
          titleVariant: 'h5',
          marginTop: 2,
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            wasStudyingLastSemester(answers),
        }),
        buildRadioField({
          id: 'education.didFinishLastSemester',
          width: 'half',
          space: 0,
          doesNotRequireAnswer: true,
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
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            wasStudyingLastSemester(answers),
        }),
        buildAlertMessageField({
          id: 'education.lastSemester.alertMessage',
          message: educationMessages.labels.lastSemesterAlertMessage,
          alertType: 'info',
          marginBottom: 0,
          doesNotRequireAnswer: true,
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            ((wasStudyingLastSemester(answers) &&
              didYouFinishLastSemester(answers) === YES) ||
              wasStudyingInTheLastYear(answers)),
        }),
        buildDescriptionField({
          id: 'education.lastSemester.appliedForNextSemesterDescription',
          title: educationMessages.labels.appliedForNextSemesterQuestion,
          titleVariant: 'h5',
          marginTop: 2,
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            wasStudyingLastSemester(answers) &&
            didYouFinishLastSemester(answers) === NO,
        }),
        buildRadioField({
          id: 'education.appliedForNextSemester',
          width: 'half',
          space: 0,
          doesNotRequireAnswer: true,
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
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            wasStudyingLastSemester(answers) &&
            didYouFinishLastSemester(answers) === NO,
        }),
        buildDescriptionField({
          id: 'education.currentEducation.typeOfEducationDescription',
          title: educationMessages.labels.typeOfEducationDescription,
          titleVariant: 'h5',
          marginTop: 2,
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            (isCurrentlyStudying(answers) ||
              wasStudyingInTheLastYear(answers) ||
              (wasStudyingLastSemester(answers) &&
                appliedForNextSemester(answers) !== NO)),
        }),
        buildSelectField({
          id: 'education.currentEducation.programName',
          title: educationMessages.labels.schoolProgramLabel,
          width: 'half',
          doesNotRequireAnswer: true,
          options: (application, _field, locale) => {
            const education = getValueViaPath<
              GaldurDomainModelsEducationItem[]
            >(
              application.externalData,
              'unemploymentApplication.data.supportData.education',
            )
            return (
              education?.map(({ name, english, id }) => {
                return {
                  label: locale === 'is' ? name ?? '' : english ?? '',
                  value: id ?? '',
                }
              }) ?? []
            )
          },
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            (isCurrentlyStudying(answers) ||
              wasStudyingInTheLastYear(answers) ||
              (wasStudyingLastSemester(answers) &&
                appliedForNextSemester(answers) !== NO)),
        }),
        buildTextField({
          id: 'education.currentEducation.programUnits',
          title: educationMessages.labels.schoolProgramUnitsLabel,
          width: 'half',
          variant: 'number',
          doesNotRequireAnswer: true,
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            (isCurrentlyStudying(answers) ||
              wasStudyingInTheLastYear(answers) ||
              (wasStudyingLastSemester(answers) &&
                appliedForNextSemester(answers) !== NO)),
        }),
        buildTextField({
          id: 'education.currentEducation.programDegree',
          title: educationMessages.labels.schoolDegreeLabel,
          width: 'half',
          doesNotRequireAnswer: true,
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            (isCurrentlyStudying(answers) ||
              wasStudyingInTheLastYear(answers) ||
              (wasStudyingLastSemester(answers) &&
                appliedForNextSemester(answers) !== NO)),
        }),
        buildDateField({
          id: 'education.currentEducation.programEnd',
          title: educationMessages.labels.currentSchoolEndDateLabel,
          width: 'half',
          doesNotRequireAnswer: true,
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            (isCurrentlyStudying(answers) ||
              wasStudyingInTheLastYear(answers) ||
              (wasStudyingLastSemester(answers) &&
                appliedForNextSemester(answers) !== NO)),
        }),
        buildDescriptionField({
          id: 'education.currentEducation.description',
          title: educationMessages.labels.currentSchoolDegreeFileLabel,
          titleVariant: 'h5',
          marginTop: 2,
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            (isCurrentlyStudying(answers) ||
              wasStudyingInTheLastYear(answers) ||
              (wasStudyingLastSemester(answers) &&
                appliedForNextSemester(answers) !== NO)),
        }),
        buildFileUploadField({
          id: 'education.currentEducation.degreeFile',
          title: educationMessages.labels.currentSchoolDegreeFileNameLabel,
          uploadHeader:
            educationMessages.labels.currentSchoolDegreeFileNameLabel,
          uploadDescription:
            educationMessages.labels.currentSchoolDegreeFileNameDescription,
          uploadAccept: '.pdf, .docx, .rtf',
          doesNotRequireAnswer: true,
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            (isCurrentlyStudying(answers) ||
              wasStudyingInTheLastYear(answers) ||
              (wasStudyingLastSemester(answers) &&
                appliedForNextSemester(answers) !== NO)),
        }),
        buildTextField({
          id: 'education.notAppliedForNextSemesterExplanation',
          title: educationMessages.labels.appliedForNextSemesterTextarea,
          variant: 'textarea',
          doesNotRequireAnswer: true,
          rows: 6,
          condition: (answers) =>
            wasStudyingLastTwelveMonths(answers) &&
            wasStudyingLastSemester(answers) &&
            appliedForNextSemester(answers) === NO &&
            didYouFinishLastSemester(answers) === NO,
        }),
      ],
    }),
  ],
})
