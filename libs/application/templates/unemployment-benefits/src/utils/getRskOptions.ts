import { Application } from '@island.is/application/types'
import { getEmploymentFromRsk } from './getEmploymenInfo'

export const getRskOptions = (application: Application) => {
  const employmentList = getEmploymentFromRsk(application.externalData)
  return employmentList
    .filter((x) => !!x.employerSSN)
    .map((job) => ({
      value: job.employerSSN ?? '',
      label:
        job.employerSSN !== '-'
          ? `${job.employer || ''}, ${job.employerSSN || ''}`
          : job.employer || '',
    }))
}
