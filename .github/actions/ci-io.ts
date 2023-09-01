import { SimpleGit } from './simple-git'
import {
  BranchWorkflow,
  GitActionStatus,
  PRWorkflow,
  WorkflowID,
} from './git-action-status'
import { execSync, spawnSync } from 'child_process'
import { Octokit } from '@octokit/rest'

import { Endpoints } from '@octokit/types'
import Debug from 'debug'
import * as unzipper from 'unzipper'
const app = Debug('change-detection:io')

const repository = process.env.GITHUB_REPOSITORY || 'island-is/island.is'
const [owner, repo] = repository.split('/')
export type ActionsListWorkflowRunsForRepoResponseData =
  Endpoints['GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs']['response']['data']
export type ActionsListJobsForWorkflowRunResponseData =
  Endpoints['GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs']['response']['data']

const hasFinishedSuccessfulJob = (
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

// took this from https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-265.php
export const chunk = <ElementType>(arr: ElementType[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  )

export class LocalRunner implements GitActionStatus {
  constructor(private octokit: Octokit) {}
  async getChangedComponents(
    git: SimpleGit,
    sha1: string,
    sha2: string,
  ): Promise<string[]> {
    const log = app.extend('calculate-distance')
    log(`Calculating distance between ${sha1} and ${sha2}`)
    const diffNames = await git.raw('diff', '--name-only', sha1, sha2)
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

    if (changedFiles.length === 0) return []
    try {
      let printAffected = spawnSync(
        `npx`,
        [
          `nx`,
          `print-affected`,
          `--select=projects`,
          ...chunk(changedFiles, 20).map(
            (chunk) => `--files=${chunk.join(',')}`,
          ),
        ],
        {
          encoding: 'utf-8',
          cwd: git.cwd,
          shell: git.shell,
        },
      )
      if (printAffected.status !== 0) {
        log(
          `Error running nx print-affected. Error is %O, stderr is %O`,
          printAffected.error,
          printAffected.stderr,
        )
        printAffected = spawnSync(
          `npx`,
          [`nx`, `print-affected`, `--select=projects`, '--all'],
          {
            encoding: 'utf-8',
            cwd: git.cwd,
            shell: git.shell,
          },
        )
        if (printAffected.status !== 0) {
          log(
            `Error running print-affected --all. Error is %O\nstderr: %O\nstdout: %O`,
            printAffected.stderr,
            printAffected.stdout,
          )
          throw printAffected.error
        }
      }
      let affectedComponents = printAffected.stdout
        .split(',')
        .map((s) => s.trim())
        .filter((c) => c.length > 0)
      log(
        `Affected components are ${
          affectedComponents.length
        }: ${affectedComponents.join(',')}`,
      )
      return affectedComponents
    } catch (e) {
      log('Error getting affected components: %O', e)
      throw e
    }
  }

  async getLastGoodBranchBuildRun(
    branch: string,
    workflowId: WorkflowID,
    candidateCommits: string[],
  ): Promise<BranchWorkflow | undefined> {
    const branchName = branch.replace('origin/', '').replace(/'/g, '')
    app(
      `Getting last good branch (push) build for branch ${branchName} with workflow ${workflowId}`,
    )

    const runsIterator = this.octokit.paginate.iterator(
      'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
      {
        owner,
        repo,
        branch: branchName,
        workflow_id: `${workflowId}.yml`,
        event: 'push',
        status: 'success',
      },
    )

    const workflowRuns: ActionsListWorkflowRunsForRepoResponseData['workflow_runs'] =
      []
    for await (const workflow_runs of runsIterator) {
      app(`Retrieved ${workflow_runs.data.length} workflow runs`)
      workflowRuns.push(
        ...workflow_runs.data.filter((run) =>
          candidateCommits.includes(run.head_sha.slice(0, 7)),
        ),
      )
      if (workflowRuns.length > 10) break
    }
    if (workflowRuns.length === 0) {
      // Attempting to use the create event if no push events. Necessary for release branches.
      const runsIteratorForCreateEvents = this.octokit.paginate.iterator(
        'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
        {
          owner,
          repo,
          branch: branchName,
          workflow_id: `${workflowId}.yml`,
          event: 'create',
          status: 'success',
        },
      )
      for await (const workflow_runs of runsIteratorForCreateEvents) {
        app(`Retrieved ${workflow_runs.data.length} workflow runs`)
        workflowRuns.push(
          ...workflow_runs.data.filter((run) =>
            candidateCommits.includes(run.head_sha.slice(0, 7)),
          ),
        )
        if (workflowRuns.length > 10) break
      }
    }
    app(`Got GHA information for ${workflowRuns.length} workflows`)

    let sortedWorkflowRuns = workflowRuns
      .map(({ run_number, head_sha, head_branch, jobs_url }) => ({
        run_number,
        sha: head_sha,
        branch: head_branch,
        jobs_url,
      }))
      .sort((a, b) => b.run_number - a.run_number)

    for (const run of sortedWorkflowRuns) {
      app(`Considering ${run.run_number} with ${run.sha} on ${run.branch}`)
      const jobs = await this.getJobs(`GET ${run.jobs_url}`)
      if (
        hasFinishedSuccessfulJob(
          jobs,
          LocalRunner.getJobName(workflowId),
          'Announce success',
        )
      ) {
        app(`Run number ${run.run_number} matches success criteria`)
        return { head_commit: run.sha, run_nr: run.run_number }
      } else {
        app(
          `Not satisfied success criteria for run ${run.run_number} with ${run.sha} on ${run.branch}`,
        )
      }
    }
    app(`Done iterating over runs, nothing good found`)
    return undefined
  }

  private static getJobName(workflowId: WorkflowID): string {
    switch (workflowId) {
      case 'pullrequest':
        return 'success'
      case 'push':
        return 'push-success'
      default:
        throw new Error(`Unexpected workflow ID`)
    }
  }

  async getLastGoodPRRun(
    branch: string,
    workflowId: WorkflowID,
    commits: string[],
  ): Promise<PRWorkflow | undefined> {
    const branchName = branch.replace('origin/', '').replace(/'/g, '')
    app(
      `Getting last good PR (pull_request) run for branch ${branchName} with workflow ${workflowId}`,
    )
    const runsIterator = this.octokit.paginate.iterator(
      'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
      {
        owner,
        repo,
        branch: branchName,
        workflow_id: `${workflowId}.yml`,
        event: 'pull_request',
        status: 'success',
      },
    )

    const workflowRuns: ActionsListWorkflowRunsForRepoResponseData['workflow_runs'] =
      []
    for await (const workflow_runs of runsIterator) {
      app(`Retrieved ${workflow_runs.data.length} workflow runs`)
      workflowRuns.push(...workflow_runs.data)
      if (workflowRuns.length > 10) break
    }
    app(`Got GHA information for ${workflowRuns.length} workflows`)

    let sortedWorkflowRuns = workflowRuns
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

    for (const run of sortedWorkflowRuns) {
      app(`Considering ${run.run_number} with ${run.sha} on ${run.branch}`)
      const jobs = await this.getJobs(`GET ${run.jobs_url}`)
      if (
        hasFinishedSuccessfulJob(
          jobs,
          LocalRunner.getJobName(workflowId),
          'Announce success',
        )
      ) {
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
          try {
            const artifact = (await this.octokit.actions.downloadArtifact({
              owner: owner,
              repo: repo,
              artifact_id: artifactUrls[0].id,
              archive_format: 'zip',
            })) as any

            const dir = await unzipper.Open.buffer(
              new Uint8Array(artifact.data),
            )
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
          } catch (e) {
            app(
              `Error: failed processing PR metadata artifact: ${e.toString()}`,
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
