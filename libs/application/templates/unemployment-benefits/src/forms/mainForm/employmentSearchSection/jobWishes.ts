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
import {
  isEmployed,
  isEmployedAtAll,
  isEmployedPartTime,
  isOccasionallyEmployed,
} from '../../../utils'
import { Application } from '@island.is/application/types'

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
          id: 'currentSituation.wantedJobDescription',
          title: employmentSearchMessages.jobWishes.wantedJobDescription,
          titleVariant: 'h5',
          marginTop: 2,
        }),
        buildTextField({
          id: 'currentSituation.wantedJobPercentage',
          title: employmentSearchMessages.jobWishes.jobPercentage,
          variant: 'number',
          suffix: '%',
        }),
        buildAlertMessageField({
          id: 'currentSituation.wantedJobAlert',
          message: employmentSearchMessages.jobWishes.wantedJobInfoBox,
          alertType: 'info',
          doesNotRequireAnswer: true,
        }),
        buildDescriptionField({
          id: 'currentSituation.jobTimelineDescription',
          title: employmentSearchMessages.jobWishes.jobTimelineDescription,
          titleVariant: 'h5',
          marginTop: 2,
        }),
        buildDateField({
          id: 'currentSituation.jobTimelineStartDate',
          title: employmentSearchMessages.jobWishes.jobTimelineDateLabel,
          minDate: (application: Application) => {
            const endDate =
              getValueViaPath<string>(
                application.answers,
                'currentSituation.currentJob.endDate',
              ) || ''
            //TODO setja þetta 2 vikur frammí tímann
            return endDate ? new Date(endDate) : new Date()
          },
        }),
        buildAlertMessageField({
          id: 'currentSituation.jobTimelineAlert',
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
