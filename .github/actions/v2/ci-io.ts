import { DefaultLogFields, ListLogLine, SimpleGit } from 'simple-git'
import {
  BranchWorkflow,
  GitActionStatus,
  PRWorkflow,
} from './git-action-status'
import { execSync } from 'child_process'
// import { Octokit } from '@octokit/action'
import { Octokit } from '@octokit/rest'

import {
  ActionsListWorkflowRunsForRepoResponseData,
  SuccessWorkflowsForBranch,
  WorkflowQueries,
} from '../detection'
import { Endpoints } from '@octokit/types'
const octokit = new Octokit(
  // For local development
  {
    auth: process.env.GITHUB_TOKEN,
  },
)
const repository = process.env.GITHUB_REPOSITORY || '/'
const [owner, repo] = repository.split('/')
const workflow_file_name = 'push.yml'
export type ActionsListJobsForWorkflowRunResponseData = Endpoints['GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs']['response']['data']

class GitHubWorkflowQueries {
  async getData(branch: string): Promise<string | 'not found'> {
    let data = (
      await octokit.request(
        'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
        {
          owner,
          repo,
          branch,
          workflow_id: workflow_file_name,
          event: 'push',
          status: 'success',
        },
      )
    ).data

    let sorted = data.workflow_runs
      .map(({ run_number, head_sha, head_branch, jobs_url }) => ({
        run_number,
        sha: head_sha,
        branch: head_branch,
        jobs_url,
      }))
      .sort((a, b) => b.run_number - a.run_number)
    for (const run of sorted) {
      const jobs = await this.getJobs(`GET ${run.jobs_url}`)
      if (filterSkippedSuccessBuilds(jobs)) {
        return run.sha
      }
    }
    return 'not found'
  }

  async getJobs(
    jobs_url: string,
  ): Promise<ActionsListJobsForWorkflowRunResponseData> {
    return (await octokit.request(jobs_url)).data
  }
}

const filterSkippedSuccessBuilds = (
  run: ActionsListJobsForWorkflowRunResponseData,
): boolean => {
  const { jobs } = run
  const successJob = jobs.find((job) => job.name === 'push-success')
  if (successJob) {
    const { steps } = successJob
    const announceSuccessStep =
      steps && steps.find((step) => step.name === 'Announce success')
    return announceSuccessStep && announceSuccessStep.conclusion === 'success'
  }
  return false
}

export class LocalRunner implements GitActionStatus {
  calculateDistance(
    git: SimpleGit,
    currentSha: string,
    p: DefaultLogFields & ListLogLine,
  ): Promise<string[]> {
    const target = 'docker-express'
    const printAffected = execSync(
      `nx print-affected --target="${target}" --select=tasks.target.project --head=${currentSha} --base=${p.hash}`,
      { stdio: 'inherit', encoding: 'utf-8' },
    )
    return Promise.resolve(printAffected.split(' ').map((s) => s.trim()))
  }

  async getBranchBuilds(branch: string): Promise<BranchWorkflow[]> {
    const d = await new GitHubWorkflowQueries().getData(branch)
    if (d === 'not found') {
      return Promise.resolve([])
    } else {
      return Promise.resolve([{ head_commit: d }])
    }
  }

  getPRRuns(prID: number): Promise<PRWorkflow[]> {
    return Promise.resolve([])
  }
}
