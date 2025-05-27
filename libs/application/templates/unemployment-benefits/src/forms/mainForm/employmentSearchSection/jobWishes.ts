import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildSelectField,
  getValueViaPath,
  buildCheckboxField,
  YES,
  coreMessages,
  NO,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

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
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: 'jobWishes.jobList',
          title: employmentSearchMessages.jobWishes.employmentListLabel,
          isMulti: true,
          options: (application) => {
            // TODO: get jobList from externalData when service is ready
            const jobList = getValueViaPath<{ name: string }[]>(
              application.externalData,
              'jobList',
            ) ?? [
              {
                name: 'Veitingarstörf',
              },
              {
                name: 'Skrifstofustarf',
              },
              {
                name: 'Þjónustustörf',
              },
            ]
            return jobList.map((job) => ({
              value: job.name,
              label: job.name,
            }))
          },
        }),
        buildDescriptionField({
          id: 'jobWishes.outsideYourLocation.description',
          title: employmentSearchMessages.jobWishes.employmentLocationInterest,
          titleVariant: 'h5',
          marginTop: 3,
        }),
        buildCheckboxField({
          id: 'jobWishes.outsideYourLocation',
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

        //TODO: Missing info about ESCO code - see design when ready.
      ],
    }),
  ],
})
