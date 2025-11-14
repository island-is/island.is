import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { GaldurDomainModelsSettingsJobCodesJobCodeDTO } from '@island.is/clients/vmst-unemployment'
import { Locale } from '@island.is/shared/types'

export const getJobCodeOptions = (
  application: Application,
  locale?: Locale,
) => {
  const jobList =
    getValueViaPath<GaldurDomainModelsSettingsJobCodesJobCodeDTO[]>(
      application.externalData,
      'unemploymentApplication.data.supportData.jobCodes',
    ) ?? []
  return jobList.map((job) => ({
    value: (locale === 'is' ? job.name : job.english ?? job.name) || '',
    label: (locale === 'is' ? job.name : job.english ?? job.name) || '',
  }))
}
