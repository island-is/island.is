import { SimpleGit } from 'simple-git'
import {
  BranchWorkflow,
  GitActionStatus,
  PRWorkflow,
} from './git-action-status'
import { execSync } from 'child_process'
// import { Octokit } from '@octokit/action'
import { Octokit } from '@octokit/rest'

import { ActionsListWorkflowRunsForRepoResponseData } from '../detection'
import { Endpoints } from '@octokit/types'
import { join } from 'path'
import Debug from 'debug'
const app = Debug('change-detection:io')

const repository = process.env.GITHUB_REPOSITORY || '/'
const [owner, repo] = repository.split('/')
const workflow_file_name = 'push.yml'
const pr_file_name = 'pullrequest.yml'
export type ActionsListJobsForWorkflowRunResponseData = Endpoints['GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs']['response']['data']

const filterSkippedSuccessBuilds = (
  run: ActionsListJobsForWorkflowRunResponseData,
  jobName: string,
  stepName: string,
): boolean => {
  const { jobs } = run
  const successJob = jobs.find((job) => job.name === jobName)
  if (successJob) {
    const { steps } = successJob
    const announceSuccessStep =
      steps && steps.find((step) => step.name === stepName)
    return announceSuccessStep && announceSuccessStep.conclusion === 'success'
  }
  return false
}

export class LocalRunner implements GitActionStatus {
  constructor(private octokit: Octokit) {}
  calculateDistance(
    git: SimpleGit,
    currentSha: string,
    olderSha: string,
  ): Promise<string[]> {
    const log = app.extend('calculate-distance')
    log(`Calculating distance between current: ${currentSha} and ${olderSha}`)
    let monorepoRoot = join(__dirname, '..', '..', '..')

    const printAffected = execSync(
      `npx nx print-affected --select=tasks.target.project --head=${currentSha} --base=${olderSha}`,
      {
        encoding: 'utf-8',
        cwd: monorepoRoot,
      },
    )
    let affectedComponents = printAffected
      .split(',')
      .map((s) => s.trim())
      .filter((c) => c.length > 0)
    log(
      `Affected components are ${
        affectedComponents.length
      }: ${affectedComponents.join(',')}`,
    )
    return Promise.resolve(affectedComponents)
  }

  async getLastGoodBranchBuildRun(
    branch: string,
    candidateCommits: string[],
  ): Promise<BranchWorkflow | undefined> {
    const branchName = branch.replace('origin/', '')
    app(`Getting last good branch(push) build for branch ${branchName}`)

    const runsIterator = this.octokit.paginate.iterator(
      'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
      {
        owner,
        repo,
        branch: branchName,
        workflow_id: workflow_file_name,
        event: 'push',
        status: 'success',
      },
    )

    const runs: ActionsListWorkflowRunsForRepoResponseData['workflow_runs'] = []
    for await (const workflow_runs of runsIterator) {
      runs.push(
        ...workflow_runs.data.filter((run) =>
          candidateCommits.includes(run.head_sha.slice(0, 7)),
        ),
      )
      if (runs.length > 40) break
    }
    app(`Got GHA information for ${runs.length} workflows`)

    let sorted = runs
      .map(({ run_number, head_sha, head_branch, jobs_url }) => ({
        run_number,
        sha: head_sha,
        branch: head_branch,
        jobs_url,
      }))
      .sort((a, b) => b.run_number - a.run_number)

    for (const run of sorted) {
      app(`Considering ${run.run_number} with ${run.sha} on ${run.branch}`)
      const jobs = await this.getJobs(`GET ${run.jobs_url}`)
      if (
        filterSkippedSuccessBuilds(jobs, 'push-success', 'Announce success')
      ) {
        app(`Run number ${run.run_number} matches success criteria`)
        return { head_commit: run.sha, run_nr: run.run_number }
      }
    }
    app(`Done iterating over runs, nothing good found`)
    return undefined
  }

  async getLastGoodPRRun(branch: string): Promise<PRWorkflow | undefined> {
    const branchName = branch.replace('origin/', '')
    app(`Getting last good PR(pull_request) run for branch ${branchName}`)
    const runsIterator = this.octokit.paginate.iterator(
      'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
      {
        owner,
        repo,
        branch: branchName,
        workflow_id: pr_file_name,
        event: 'pull_request',
        status: 'success',
      },
    )

    const runs: ActionsListWorkflowRunsForRepoResponseData['workflow_runs'] = []
    for await (const workflow_runs of runsIterator) {
      runs.push(...workflow_runs.data)
      if (runs.length > 40) break
    }
    app(`Got GHA information for ${runs.length} workflows`)

    let sorted = runs
      .map(
        ({ run_number, head_sha, head_branch, jobs_url, pull_requests }) => ({
          run_number,
          sha: head_sha,
          branch: head_branch,
          jobs_url,
          pull_requests,
        }),
      )
      .sort((a, b) => b.run_number - a.run_number)

    for (const run of sorted) {
      app(`Considering ${run.run_number} with ${run.sha} on ${run.branch}`)
      const jobs = await this.getJobs(`GET ${run.jobs_url}`)
      if (filterSkippedSuccessBuilds(jobs, 'success', 'Announce success')) {
        let headCommit = run.pull_requests[0].head.sha
        let baseCommit = run.pull_requests[0].base.sha
        app(
          `Run number ${run.run_number} matches success criteria, head sha: ${headCommit} and base sha: ${baseCommit}`,
        )
        return {
          head_commit: headCommit,
          run_nr: run.run_number,
          base_commit: baseCommit,
        }
      }
    }
    app(`Done iterating over PR runs, nothing good found`)
    return undefined
  }
  private async getJobs(
    jobs_url: string,
  ): Promise<ActionsListJobsForWorkflowRunResponseData> {
    app(`Requesting jobs info at ${jobs_url}`)
    return (await this.octokit.request(jobs_url)).data
  }
}
