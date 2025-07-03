import { GaldurDomainModelsSettingsJobCodesJobCodeDTO } from '@island.is/clients/vmst-unemployment'
import { JobCode } from './types'

export const isValidJob = (
  job: GaldurDomainModelsSettingsJobCodesJobCodeDTO,
): job is JobCode => !!job.id && !!job.name && !!job.english
