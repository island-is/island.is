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
          doesNotRequireAnswer: true,
          fields: {
            companyName: {
              component: 'input',
              label: jobHistory.labels.companyName,
              type: 'text',
              width: 'full',
            },
            jobName: {
              component: 'select',
              label: jobHistory.labels.jobName,
              width: 'full',
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
            employmentRate: {
              component: 'input',
              label: jobHistory.labels.employmentRate,
              width: 'full',
              type: 'number',
              placeholder: '0%',
              suffix: '%',
            },
            startDate: {
              component: 'date',
              label: jobHistory.labels.startDate,
              width: 'half',
              maxDate: new Date(),
            },
            endDate: {
              component: 'date',
              label: jobHistory.labels.endDate,
              width: 'half',
            },
          },
        }),
      ],
    }),
  ],
})
