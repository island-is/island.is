import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const getCombinedPercentage = (answers: FormValue) => {
  const lastJobPercentage = getValueViaPath<string>(
    answers,
    'employmentHistory.lastJob.percentage',
  )
  const addedJobs = getValueViaPath<any>(
    answers,
    'employmentHistory.previousJobs',
    [],
  )

  const addedJobsPercentage = addedJobs.reduce((acc: string, job: any) => {
    return acc + (job.percentage ? parseFloat(job.percentage) : 0)
  }, 0)

  return parseFloat(lastJobPercentage || '0') + addedJobsPercentage
}
