import { Octokit } from '@octokit/rest'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const OWNER = process.env.GITHUB_ORG
const REPO = process.env.GITHUB_REPO
const WORKFLOW_FILE = 'push.yml'

if (!GITHUB_TOKEN || !OWNER || !REPO) {
  console.error(
    'GITHUB_TOKEN, GITHUB_ORG, or GITHUB_REPO is not set in the environment variables.',
  )
  process.exit(1)
}

const octokit = new Octokit({ auth: GITHUB_TOKEN })

async function fetchActionOutput() {
  try {
    // Fetch workflow runs
    const { data: workflowRuns } = await octokit.actions.listWorkflowRuns({
      owner: OWNER,
      repo: REPO,
      workflow_id: WORKFLOW_FILE,
      per_page: 10,
    })

    console.log(`Workflow: ${WORKFLOW_FILE}`)

    for (const run of workflowRuns.workflow_runs) {
      if (
        run.head_branch.startsWith('pre-release/') ||
        run.head_branch.startsWith('release/')
      ) {
        console.log(`\nBranch: ${run.head_branch}`)
        console.log(`Run ID: ${run.id}`)
        console.log(`Created: ${run.created_at}`)
        console.log(`Status: ${run.status}`)
        console.log(`Conclusion: ${run.conclusion}`)

        // Fetch jobs for this run
        const { data: jobs } = await octokit.actions.listJobsForWorkflowRun({
          owner: OWNER,
          repo: REPO,
          run_id: run.id,
        })

        for (const job of jobs.jobs) {
          console.log(`\n  Job: ${job.name}`)
          for (const step of job.steps) {
            console.log(`    Step: ${step.name} (${step.conclusion})`)

            // Unfortunately, the REST API doesn't provide direct access to step outputs
            // You would need to parse the logs to get this information
          }
        }
        console.log('---')
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    if (error.response) {
      console.error(`Status: ${error.response.status}`)
      console.error(`Message: ${error.response.data.message}`)
    }
  }
}

fetchActionOutput()
