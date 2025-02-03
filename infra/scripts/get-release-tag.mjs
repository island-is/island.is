import { Octokit } from '@octokit/rest'

async function getWorkflowJobStepOutputs(config) {
  const { owner, repo, workflowId, branch, auth } = config

  const octokit = new Octokit({ auth })

  try {
    // Get the workflow run
    const { data: workflowRuns } = await octokit.actions.listWorkflowRuns({
      owner,
      repo,
      workflow_id: workflowId,
      branch: branch,
      per_page: 1,
    })

    if (workflowRuns.total_count === 0) {
      throw new Error(
        `No workflow runs found for workflow ID ${workflowId} on branch ${branch}`,
      )
    }

    const latestRun = workflowRuns.workflow_runs[0]
    console.log(
      `Found workflow run: ${latestRun.id} (Status: ${latestRun.status})`,
    )

    // Get all jobs for the workflow run
    const { data: jobsResponse } = await octokit.actions.listJobsForWorkflowRun(
      {
        owner,
        repo,
        run_id: latestRun.id,
      },
    )

    // Get the prepare job specifically
    const prepareJob = jobsResponse.jobs.find((job) => job.name === 'prepare')

    if (!prepareJob) {
      console.log(
        'Available jobs:',
        jobsResponse.jobs.map((job) => job.name),
      )
      throw new Error('Prepare job not found')
    }

    // Get the job logs
    const { data: logs } = await octokit.actions.downloadJobLogsForWorkflowRun({
      owner,
      repo,
      job_id: prepareJob.id,
    })

    // Split logs into lines
    const logLines = logs.split('\n')

    // Look for the line with the actual Docker tag value
    let dockerTag = null

    // Find the line where the Docker tag is printed with its resolved value
    const tagLine = logLines.find(
      (line) =>
        line.includes('DOCKER_TAG:') &&
        !line.includes('${') &&
        !line.includes('LAST_GOOD_BUILD'),
    )

    if (tagLine) {
      const match = tagLine.match(/DOCKER_TAG:\s*(.+?)$/)
      if (match) {
        dockerTag = match[1].trim()
      }
    }

    return {
      runId: latestRun.id,
      status: latestRun.status,
      conclusion: latestRun.conclusion,
      dockerTag,
    }
  } catch (error) {
    console.error('Error fetching job outputs:', error)
    throw error
  }
}

// Parse command line arguments
async function main() {
  const args = process.argv.slice(2)
  const branchName = args[0]
  const repoName = args[1] || 'island.is'

  if (!branchName) {
    console.error('Error: Branch name is required')
    console.error('Usage: node script.js <branch-name> [repo-name]')
    console.error('Example: node script.js main')
    console.error('Example: node script.js main my-repo')
    process.exit(1)
  }

  const config = {
    owner: 'island-is',
    repo: repoName,
    workflowId: 'push.yml',
    branch: branchName,
    auth: process.env.GITHUB_TOKEN,
  }

  if (!process.env.GITHUB_TOKEN) {
    console.error('Error: GITHUB_TOKEN environment variable is required')
    process.exit(1)
  }

  try {
    const result = await getWorkflowJobStepOutputs(config)
    if (result.dockerTag) {
      console.log('Docker tag:', result.dockerTag)
    } else {
      console.log('Docker tag not found')
      console.log('Run status:', result.status)
      console.log('Run conclusion:', result.conclusion)
    }
  } catch (error) {
    console.error('Failed to fetch job outputs:', error)
    process.exit(1)
  }
}

main()
