// @ts-check
import { ENV_JOB_STATUS } from './_const.mjs'
import { writeToOutputPost } from './_get_hashes_utils.mjs'

if (!process.env[ENV_JOB_STATUS]) {
  console.error('No cache jobs found')
  process.exit(1)
}

const jobsSuccess = JSON.parse(process.env[ENV_JOB_STATUS])
const hasFailedJobs = Object.entries(jobsSuccess).some(
  ([_jobName, jobsSuccess]) => {
    if (!jobsSuccess) {
      return true
    }
    return false
  },
)

if (hasFailedJobs) {
  console.error('Failed cache jobs')
  await writeToOutputPost(false)
  process.exit(1)
}
console.info('Done')
await writeToOutputPost(true)
process.exit(0)
