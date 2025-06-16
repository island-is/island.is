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
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'
import { GaldurDomainModelsSettingsJobCodesJobCodeDTO } from '@island.is/clients/vmst-unemployment'

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
          options: (application) => {
            // TODO: get locations from externalData when service is ready
            const locations =
              getValueViaPath<{ name: string }[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.serviceAreas',
              ) || []
            return locations.map((location) => ({
              value: location.name,
              label: location.name,
            }))
          },
        }),
      ],
    }),
  ],
})
