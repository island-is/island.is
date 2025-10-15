import {
  buildAlertMessageField,
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
import {
  education as educationMessages,
  application as applicationMessages,
} from '../../../lib/messages'
import { EducationType } from '../../../shared'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../../shared/constants'
import {
  appliedForNextSemester,
  didYouFinishLastSemester,
  showAppliedForNextSemester,
  showCurrentEducationFields,
  wasStudyingInTheLastYear,
  wasStudyingLastSemester,
  wasStudyingLastTwelveMonths,
} from '../../../utils/educationInformation'
import { GaldurDomainModelsEducationProgramDTO } from '@island.is/clients/vmst-unemployment'
import { Application } from '@island.is/application/types'

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
        buildRadioField({
          id: 'education.typeOfEducation',
          space: 0,
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
        buildDescriptionField({
          id: 'education.currentEducation.typeOfEducationDescription',
          title: educationMessages.labels.typeOfEducationDescription,
          titleVariant: 'h5',
          marginTop: 2,
          condition: showCurrentEducationFields,
        }),
        buildSelectField({
          id: 'education.currentEducation.levelOfStudy',
          title: educationMessages.labels.levelOfStudyLabel,
          width: 'half',
          required: true,
          options: (application, _, locale) => {
            const education =
              getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.educationPrograms',
              ) ?? []
            return (
              education.map((program) => ({
                value: program.id ?? '',
                label:
                  (locale === 'is'
                    ? program.name
                    : program.english ?? program.name) || '',
              })) ?? []
            )
          },
          condition: showCurrentEducationFields,
        }),
        buildTextField({
          id: 'education.currentEducation.units',
          title: educationMessages.labels.schoolProgramUnitsLabel,
          width: 'half',
          variant: 'number',
          required: true,
          condition: showCurrentEducationFields,
        }),
        buildSelectField({
          id: 'education.currentEducation.degree',
          title: educationMessages.labels.schoolDegreeLabel,
          width: 'half',
          required: true,
          options: (application, _, locale) => {
            const education =
              getValueViaPath<GaldurDomainModelsEducationProgramDTO[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.educationPrograms',
              ) ?? []

            const levelOfStudy =
              getValueViaPath<string>(
                application.answers,
                'education.currentEducation.levelOfStudy',
                '',
              ) ?? ''
            const chosenLevelDegrees = education?.filter(
              (program) => program.id === levelOfStudy,
            )[0]?.degrees
            return (
              chosenLevelDegrees?.map((degree) => ({
                value: degree.id ?? '',
                label:
                  (locale === 'is'
                    ? degree.name
                    : degree.english ?? degree.name) || '',
              })) ?? []
            )
          },
          condition: showCurrentEducationFields,
        }),
        buildSelectField({
          id: 'education.currentEducation.courseOfStudy',
          title: educationMessages.labels.courseOfStudyLabel,
          width: 'half',
          options: (application) => {
            const education = getValueViaPath<
              GaldurDomainModelsEducationProgramDTO[]
            >(
              application.externalData,
              'unemploymentApplication.data.supportData.educationPrograms',
            )
            const levelOfStudy =
              getValueViaPath<string>(
                application.answers,
                'education.currentEducation.levelOfStudy',
                '',
              ) ?? ''

            const degreeAnswer =
              getValueViaPath<string>(
                application.answers,
                'education.currentEducation.degree',
                '',
              ) ?? ''
            const chosenLevelDegrees = education?.filter(
              (program) => program.id === levelOfStudy,
            )[0]?.degrees

            const chosenDegreeSubjects = chosenLevelDegrees?.find(
              (degree) => degree.id === degreeAnswer,
            )?.subjects
            return (
              chosenDegreeSubjects?.map((subject) => ({
                value: subject.id ?? '',
                label: subject.name ?? '',
              })) ?? []
            )
          },
          condition: showCurrentEducationFields,
        }),
        buildDateField({
          id: 'education.currentEducation.endDate',
          title: (application: Application) => {
            const previousLabel =
              wasStudyingInTheLastYear(application.answers) ||
              wasStudyingLastSemester(application.answers)
            return previousLabel
              ? educationMessages.labels.previousSchoolEndDate
              : educationMessages.labels.expectedEndOfStudyLabel
          },
          width: 'half',
          required: true,
          condition: showCurrentEducationFields,
        }),
        buildAlertMessageField({
          id: 'education.currentEducation.description',
          message: educationMessages.labels.currentSchoolDegreeInformation,
          alertType: 'info',
          condition: showCurrentEducationFields,
        }),
        buildFileUploadField({
          id: 'education.currentEducation.degreeFile',
          title: educationMessages.labels.currentSchoolDegreeFileNameLabel,
          uploadHeader:
            educationMessages.labels.currentSchoolDegreeFileNameLabel,
          uploadDescription: applicationMessages.fileUploadAcceptFiles,
          uploadAccept: UPLOAD_ACCEPT,
          maxSize: FILE_SIZE_LIMIT,
          uploadMultiple: true,
          doesNotRequireAnswer: true,
          condition: showCurrentEducationFields,
        }),
        buildTextField({
          id: 'education.notAppliedForNextSemesterExplanation',
          title: educationMessages.labels.appliedForNextSemesterTextarea,
          variant: 'textarea',
          required: true,
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
