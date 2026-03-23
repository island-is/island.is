import { Application, FormatMessage } from '@island.is/application/types'
import { getEmploymentFromRsk } from './getEmploymenInfo'

export const getRskOptions = (
  application: Application,
  formatMessage?: FormatMessage,
) => {
  const employmentList = getEmploymentFromRsk(
    application.externalData,
    formatMessage,
  )
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
