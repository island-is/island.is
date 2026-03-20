import { getValueViaPath } from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import { GaldurDomainModelsSettingsJobCodesJobCodeDTO } from '@island.is/clients/vmst-unemployment'
import { Locale } from '@island.is/shared/types'

export const getJobCodeOptions = (
  application: Application,
  locale?: Locale,
) => {
  const sorted = getSortedJobCodes(application.externalData, locale)
  return sorted.map((job) => ({
    value: job.id || '',
    label: (locale === 'is' ? job.name : job.english ?? job.name) || '',
  }))
}

export const getSortedJobCodes = (
  externalData: ExternalData,
  locale?: Locale,
) => {
  const jobList =
    getValueViaPath<GaldurDomainModelsSettingsJobCodesJobCodeDTO[]>(
      externalData,
      'unemploymentApplication.data.supportData.jobCodes',
    ) ?? []

  const getName = (job: GaldurDomainModelsSettingsJobCodesJobCodeDTO) =>
    (locale === 'is' ? job.name : job.english ?? job.name) ?? ''

  const sorted = [...jobList].sort((a, b) =>
    getName(a).localeCompare(getName(b), locale, { sensitivity: 'base' }),
  )

  return sorted
}

export const getJobInfo = (externalData: ExternalData, jobId?: string) => {
  const jobList =
    getValueViaPath<GaldurDomainModelsSettingsJobCodesJobCodeDTO[]>(
      externalData,
      'unemploymentApplication.data.supportData.jobCodes',
    ) ?? []

  return jobList.find((x) => x.id === jobId)
}
