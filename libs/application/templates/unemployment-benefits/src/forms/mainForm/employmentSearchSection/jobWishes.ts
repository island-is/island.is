import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildSelectField,
  getValueViaPath,
  YES,
  coreMessages,
  NO,
  buildRadioField,
  buildTextField,
  buildAlertMessageField,
  buildDateField,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'
import {
  GaldurDomainModelsSettingsJobCodesJobCodeDTO,
  GaldurDomainModelsSettingsServiceAreasServiceAreaDTO,
} from '@island.is/clients/vmst-unemployment'
import { Application } from '@island.is/application/types'
import { CurrentEmploymentInAnswers, EmploymentStatus } from '../../../shared'

export const jobWishesSubSection = buildSubSection({
  id: 'jobWishesSubSection',
  title: employmentSearchMessages.jobWishes.sectionTitle,
  children: [
    buildMultiField({
      id: 'jobWishesSubSection',
      title: employmentSearchMessages.jobWishes.pageTitle,
      children: [
        buildDescriptionField({
          id: 'jobWishes.jobList.description',
          title: employmentSearchMessages.jobWishes.employmentListQuestion,
          description:
            employmentSearchMessages.jobWishes.employmentListDescription,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: 'jobWishes.jobList',
          title: employmentSearchMessages.jobWishes.employmentListLabel,
          isMulti: true,
          required: true,
          options: (application, _, locale) => {
            const jobList =
              getValueViaPath<GaldurDomainModelsSettingsJobCodesJobCodeDTO[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.jobCodes',
              ) ?? []
            return jobList.map((job) => ({
              value: job.id ?? '',
              label:
                (locale === 'is' ? job.name : job.english ?? job.name) || '',
            }))
          },
        }),
        buildDescriptionField({
          id: 'jobWishes.wantedJobDescription',
          title: employmentSearchMessages.jobWishes.wantedJobDescription,
          titleVariant: 'h5',
          marginTop: 2,
        }),
        buildTextField({
          id: 'jobWishes.wantedJobPercentage',
          title: employmentSearchMessages.jobWishes.jobPercentage,
          variant: 'number',
          suffix: '%',
          required: true,
          min: 0,
          max: 100,
        }),
        buildAlertMessageField({
          id: 'jobWishes.wantedJobAlert',
          message: employmentSearchMessages.jobWishes.wantedJobInfoBox,
          alertType: 'info',
          doesNotRequireAnswer: true,
        }),
        buildDescriptionField({
          id: 'jobWishes.jobTimelineDescription',
          title: employmentSearchMessages.jobWishes.jobTimelineDescription,
          titleVariant: 'h5',
          marginTop: 2,
        }),
        buildDateField({
          id: 'jobWishes.jobTimelineStartDate',
          title: employmentSearchMessages.jobWishes.jobTimelineDateLabel,
          required: true,
          maxDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
          minDate: (application: Application) => {
            const repeaterJobs =
              getValueViaPath<CurrentEmploymentInAnswers[]>(
                application.answers,
                'currentSituation.currentSituationRepeater',
                [],
              ) ?? []

            const status =
              getValueViaPath<EmploymentStatus>(
                application.answers,
                'currentSituation.status',
                undefined,
              ) ?? undefined
            //If applicant has a job end timeline
            if (status === EmploymentStatus.EMPLOYED) {
              return repeaterJobs[0] && repeaterJobs[0].predictedEndDate
                ? new Date(repeaterJobs[0].predictedEndDate)
                : new Date()
            }
            return new Date()
          },
        }),
        buildAlertMessageField({
          id: 'jobWishes.jobTimelineAlert',
          message: employmentSearchMessages.jobWishes.jobTimelineInfoBox,
          alertType: 'info',
          doesNotRequireAnswer: true,
        }),
        buildDescriptionField({
          id: 'jobWishes.outsideYourLocation.description',
          title: employmentSearchMessages.jobWishes.employmentLocationInterest,
          titleVariant: 'h5',
          marginTop: 3,
        }),
        buildRadioField({
          id: 'jobWishes.outsideYourLocation',
          width: 'half',
          required: true,
          space: 0,
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
        buildSelectField({
          id: 'jobWishes.location',
          title: employmentSearchMessages.jobWishes.location,
          isMulti: true,
          required: true,
          options: (application, _, locale) => {
            const locations =
              getValueViaPath<
                GaldurDomainModelsSettingsServiceAreasServiceAreaDTO[]
              >(
                application.externalData,
                'unemploymentApplication.data.supportData.serviceAreas',
              ) || []
            return locations.map((location) => ({
              value: location.id ?? '',
              label:
                (locale === 'is'
                  ? location.name
                  : location.english ?? location.name) || '',
            }))
          },
          condition: (answers) => {
            return (
              getValueViaPath(answers, 'jobWishes.outsideYourLocation') === YES
            )
          },
        }),
      ],
    }),
  ],
})
