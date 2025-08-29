import {
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { jobHistory } from '../../lib/messages'
import { GaldurDomainModelsSettingsJobCodesJobCodeDTO } from '@island.is/clients/vmst-unemployment'
import { Application } from '@island.is/application/types'
import { isValidJob } from '../../utils/isValidJobCode'
import { Locale } from '@island.is/shared/types'

export const jobHistorySection = buildSection({
  id: 'jobHistorySection',
  title: jobHistory.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'jobHistoryMultiField',
      title: jobHistory.general.pageTitle,
      description: jobHistory.general.description,
      children: [
        buildFieldsRepeaterField({
          id: 'jobHistory',
          titleVariant: 'h5',
          marginTop: 0,
          formTitle: jobHistory.labels.jobTitle,
          addItemButtonText: jobHistory.labels.addNewButton,
          minRows: 0,
          doesNotRequireAnswer: true,
          fields: {
            companyName: {
              component: 'input',
              label: jobHistory.labels.companyName,
              type: 'text',
              width: 'half',
              required: true,
            },
            jobName: {
              component: 'select',
              label: jobHistory.labels.jobName,
              width: 'half',
              required: true,
              options: (
                application: Application,
                _activeField: Record<string, string> | undefined,
                locale: Locale | undefined,
              ) => {
                const escoJobs = getValueViaPath<
                  GaldurDomainModelsSettingsJobCodesJobCodeDTO[]
                >(
                  application.externalData,
                  'activityGrantApplication.data.activationGrant.supportData.jobCodes',
                )

                return (escoJobs ?? []).filter(isValidJob).map((job) => {
                  const label = locale === 'is' ? job.name : job.english
                  const value = job.id
                  return { value, label }
                })
              },
            },
            startDate: {
              component: 'date',
              label: jobHistory.labels.startDate,
              width: 'half',
              minYear: 1940,
              maxYear: new Date().getFullYear(),
              maxDate: new Date(),
              required: true,
            },
            endDate: {
              component: 'date',
              label: jobHistory.labels.endDate,
              width: 'half',
              required: true,
              minYear: 1940,
              maxYear: new Date().getFullYear(),
              minDate: (_, activeField) => {
                if (activeField?.startDate) {
                  const startDate = new Date(activeField.startDate as string)
                  const nextDay = new Date(startDate)
                  nextDay.setDate(startDate.getDate() + 1)
                  return nextDay
                }

                return new Date()
              },
              maxDate: () => {
                const today = new Date()
                const plusMonth = new Date(
                  today.getFullYear(),
                  today.getMonth() + 1,
                  today.getDate(),
                )
                return plusMonth
              },
            },
          },
        }),
      ],
    }),
  ],
})
