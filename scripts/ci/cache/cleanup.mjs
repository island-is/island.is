import { ENV_JOB_STATUS } from "./_const.mjs";

const jobsSuccess = JSON.parse(process.env[ENV_JOB_STATUS]);
const hasFailedJobs = Object.entries(jobsSuccess).some(([_jobName, jobsSuccess]) => {
    if (!jobsSuccess) {
        return true
    }
    return false;
});

if (hasFailedJobs) {
    console.error("Failed cache jobs")
    process.exit(1)
}
console.info("Done")
process.exit(0);