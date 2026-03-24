import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import { GaldurDomainModelsSettingsJobCodesJobCodeDTO } from '@island.is/clients/vmst-unemployment'
import { Locale } from '@island.is/shared/types'

export const getSortedJobCodes = (
  externalData: ExternalData,
  locale?: Locale,
) => {
  const jobList =
    getValueViaPath<GaldurDomainModelsSettingsJobCodesJobCodeDTO[]>(
      externalData,
      'currentApplicationInformation.data.supportData.jobCodes',
    ) ?? []

  console.log('jobList', jobList)
  const getName = (job: GaldurDomainModelsSettingsJobCodesJobCodeDTO) =>
    (locale === 'is' ? job.name : job.english ?? job.name) ?? ''

  const sorted = [...jobList].sort((a, b) =>
    getName(a).localeCompare(getName(b), locale, { sensitivity: 'base' }),
  )

  return sorted
}
