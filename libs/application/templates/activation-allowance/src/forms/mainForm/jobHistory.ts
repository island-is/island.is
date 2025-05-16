import {
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { jobHistory } from '../../lib/messages'

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
          fields: {
            company: {
              component: 'nationalIdWithName',
              searchCompanies: true,
              customNameLabel: jobHistory.labels.companyName,
              customNationalIdLabel: jobHistory.labels.companySsn,
            },
            jobName: {
              component: 'select',
              label: jobHistory.labels.jobName,
              width: 'half',
              options: [
                // TODO: Get from API
                { value: 'option1', label: 'Almenn afgreiðsla' },
                { value: 'option2', label: 'Ekki almenn afgreiðsla' },
              ],
            },
            employmentRate: {
              component: 'input',
              label: jobHistory.labels.employmentRate,
              width: 'half',
              type: 'number',
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
