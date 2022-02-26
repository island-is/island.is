// import { SimpleGit } from 'simple-git'
import { SimpleGit } from './simple-git'
import {
  BranchWorkflow,
  GitActionStatus,
  PRWorkflow,
} from './git-action-status'
import { execSync } from 'child_process'
import { Octokit } from '@octokit/rest'

import { ActionsListWorkflowRunsForRepoResponseData } from '../detection'
import { Endpoints } from '@octokit/types'
import { join } from 'path'
import Debug from 'debug'
import * as unzipper from 'unzipper'
const app = Debug('change-detection:io')

const repository = process.env.GITHUB_REPOSITORY || '/'
const [owner, repo] = repository.split('/')
const workflow_file_name = 'push.yml'
const pr_file_name = 'pullrequest.yml'
export type ActionsListJobsForWorkflowRunResponseData = Endpoints['GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs']['response']['data']

const filterSkippedSuccessBuilds = (
  run: ActionsListJobsForWorkflowRunResponseData['jobs'],
  jobName: string,
  stepName: string,
): boolean => {
  const jobs = run
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
  async calculateDistance(
    git: SimpleGit,
    currentSha: string,
    olderSha: string,
  ): Promise<string[]> {
    const log = app.extend('calculate-distance')
    log(`Calculating distance between current: ${currentSha} and ${olderSha}`)
    const diffNames = await git.git('diff', '--name-only', currentSha, olderSha)
    const changedFiles = [
      // @ts-ignore
      ...new Set(
        diffNames
          .split('\n')
          .map((l) => l.trim())
          .filter((s) => s.length > 0),
      ),
    ]

    log(`Changed files: ${changedFiles.join(',')}`)

    if (changedFiles.length === 0) return Promise.resolve([])
    try {
      const printAffected = execSync(
        `npx nx print-affected --select=projects --files=${changedFiles.join(
          ',',
        )}`,
        {
          encoding: 'utf-8',
          cwd: git.cwd,
          shell: git.shell,
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
    } catch (e) {
      log('Error getting affected components: %O', e)
      throw e
    }
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
      app(`Retrieved ${workflow_runs.data.length} workflow runs`)
      runs.push(
        ...workflow_runs.data.filter((run) =>
          candidateCommits.includes(run.head_sha.slice(0, 7)),
        ),
      )
      if (runs.length > 10) break
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
      } else {
        app(`Not satisfied ${run.run_number} with ${run.sha} on ${run.branch}`)
      }
    }
    app(`Done iterating over runs, nothing good found`)
    return undefined
  }

  async getLastGoodPRRun(
    branch: string,
    commits: string[],
  ): Promise<PRWorkflow | undefined> {
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
      app(`Retrieved ${workflow_runs.data.length} workflow runs`)
      runs.push(...workflow_runs.data)
      if (runs.length > 10) break
    }
    app(`Got GHA information for ${runs.length} workflows`)

    let sorted = runs
      .map(
        ({
          run_number,
          head_sha,
          head_branch,
          jobs_url,
          pull_requests,
          id,
        }) => ({
          run_id: id,
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
        app(`Run number ${run.run_number} matches success criteria`)

        app(`Looking for PR metadata`)
        const artifacts = await this.octokit.actions.listWorkflowRunArtifacts({
          run_id: run.run_id,
          owner: owner,
          repo,
        })
        const artifactUrls = artifacts.data.artifacts.filter(
          (artifact) => artifact.name === 'pr-event',
        )
        if (artifactUrls.length === 1) {
          app(`Found an artifact with PR metadata`)
          const artifact = (await this.octokit.actions.downloadArtifact({
            owner: owner,
            repo: repo,
            artifact_id: artifactUrls[0].id,
            archive_format: 'zip',
          })) as any

          const dir = await unzipper.Open.buffer(new Uint8Array(artifact.data))
          const event = JSON.parse(
            (await dir.files[0].buffer()).toString('utf-8'),
          )
          app(`Got event data from PR ${run.run_number}`)
          const headSha = event.head_sha as string
          const baseSha = event.base_sha as string
          if (
            commits.includes(headSha.slice(0, 7)) &&
            commits.includes(baseSha.slice(0, 7))
          ) {
            return {
              head_commit: headSha,
              run_nr: run.run_number,
              base_commit: baseSha,
            }
          } else {
            app(
              `PR base commit ${baseSha} or head commit ${headSha} could not be matched. Most likely PR was rebased`,
            )
          }
        } else {
          app(`No PR metadata found`)
        }
      } else {
        app(`Job not successful`)
      }
    }
    app(`Done iterating over PR runs, nothing good found`)
    return undefined
  }
  private async getJobs(
    jobs_url: string,
  ): Promise<ActionsListJobsForWorkflowRunResponseData['jobs']> {
    const runs: ActionsListJobsForWorkflowRunResponseData['jobs'] = []
    const runsIterator = this.octokit.paginate.iterator(jobs_url, {})
    for await (const jobs of runsIterator) {
      app(`Requesting jobs info at ${jobs_url}`)
      runs.push(
        ...(jobs.data as ActionsListJobsForWorkflowRunResponseData['jobs']),
      )
    }
    return runs
  }
}
