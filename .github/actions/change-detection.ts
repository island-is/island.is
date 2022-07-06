import { SimpleGit } from './simple-git'
import { GitActionStatus, WorkflowID } from './git-action-status'
import Debug from 'debug'

const app = Debug('change-detection')
export type Incremental = {
  sha: string
  run_number: number
  branch: string
  ref: string
}
export type LastGoodBuild = Incremental | 'rebuild'

/***
 * Discovers the best(latest) successful branch workflow or base branch workflow that is related to the current commit
 * @param commitScore - method to measure the weight of the difference from the current commit
 * @param git - git interface
 * @param githubApi - GitHub/DigitalIceland specific api
 * @param headBranch - name of head branch of the PRs
 * @param baseBranch - name of the base branch
 * @param workflowId - workflow that is triggering the discovery process
 *
 */
export async function findBestGoodRefBranch(
  commitScore: (services: string[]) => number,
  git: SimpleGit,
  githubApi: GitActionStatus,
  headBranch: string,
  baseBranch: string,
  workflowId: WorkflowID,
): Promise<LastGoodBuild> {
  const log = app.extend('findBestGoodRefBranch')
  log(`Starting with head branch ${headBranch} and base branch ${baseBranch}`)
  const commits = await getCommits(git, headBranch, baseBranch, 'HEAD~1')
  const builds = await githubApi.getLastGoodBranchBuildRun(
    headBranch,
    workflowId,
    commits,
  )
  if (builds)
    return {
      sha: builds.head_commit,
      run_number: builds.run_nr,
      branch: headBranch,
      ref: builds.head_commit,
    }

  const baseCommits = await githubApi.getLastGoodBranchBuildRun(
    baseBranch,
    workflowId,
    commits,
  )
  if (baseCommits)
    return {
      ref: baseCommits.head_commit,
      sha: baseCommits.head_commit,
      run_number: baseCommits.run_nr,
      branch: baseBranch,
    }

  return 'rebuild'
}

/***
 * Gets the last N commits reachable by head or base branch
 * @param git - git interface
 * @param headBranch - reference to head branch
 * @param baseBranch - reference to base branch
 * @param head - reference to head commit
 * @param maxCount - maximum commit count
 */
async function getCommits(
  git: SimpleGit,
  headBranch: string,
  baseBranch: string,
  head: string,
  maxCount: number = 300,
): Promise<string[]> {
  const mergeBaseCommit = await git.raw('merge-base', headBranch, baseBranch)
  const commits = (
    await git.raw(
      'rev-list',
      '--date-order',
      `--max-count=${maxCount}`,
      head,
      `${mergeBaseCommit.trim()}`,
    )
  )
    .split('\n')
    .filter((s) => s.length > 0)
    .map((c) => c.substr(0, 7))
  return commits
}

/***
 * Discovers the best(latest) successful PR workflow or base branch workflow that is related to the current commit
 * @param diffWeight - method to measure the weight of the difference from the current commit
 * @param git - git interface
 * @param githubApi - GitHub/DigitalIceland specific api
 * @param headBranch - name of head branch of the PRs
 * @param baseBranch - name of the base branch
 * @param prBranch - branch/reference of the merge commit of the PR
 * @param workflowId - workflow that is triggering the discovery process
 */
export async function findBestGoodRefPR(
  diffWeight: (services: string[]) => number,
  git: SimpleGit,
  githubApi: GitActionStatus,
  headBranch: string,
  baseBranch: string,
  prBranch: string,
  workflowId: WorkflowID,
): Promise<LastGoodBuild> {
  const log = app.extend('findBestGoodRefPR')
  log(`Starting with head branch ${headBranch} and base branch ${baseBranch}`)
  const lastCommitSha = await git.lastCommit()
  const prCommits = await getCommits(git, headBranch, baseBranch, 'HEAD')

  const prRun = await githubApi.getLastGoodPRRun(
    headBranch,
    workflowId,
    prCommits,
  )
  const prBuilds: {
    distance: number
    hash: string
    run_nr: number
    branch: string
    ref: string
  }[] = []
  if (prRun) {
    log(`Found a PR run candidate: ${JSON.stringify(prRun)}`)
    try {
      const tempBranch = `${headBranch}-${Math.round(Math.random() * 1000000)}`
      await git.checkoutBranch(tempBranch, prRun.base_commit)
      log(`Branch checked out`)
      const mergeCommitSha = await git.merge(prRun.head_commit)
      log(`Simulated previous PR merge commit`)
      const distance = await githubApi.getChangedComponents(
        git,
        lastCommitSha,
        mergeCommitSha,
      )
      log(`Affected components since candidate PR run are ${distance}`)
      prBuilds.push({
        distance: diffWeight(distance),
        hash: prRun.head_commit,
        run_nr: prRun.run_nr,
        branch: headBranch,
        ref: mergeCommitSha,
      })
    } finally {
      await git.checkout(prBranch)
    }
  }

  const baseCommits = await getCommits(git, prBranch, baseBranch, 'HEAD~1')

  const baseGoodBuilds = await githubApi.getLastGoodBranchBuildRun(
    baseBranch,
    'push',
    baseCommits,
  )
  if (baseGoodBuilds) {
    let affectedComponents = await githubApi.getChangedComponents(
      git,
      lastCommitSha,
      baseGoodBuilds.head_commit,
    )
    prBuilds.push({
      distance: diffWeight(affectedComponents),
      hash: baseGoodBuilds.head_commit,
      run_nr: baseGoodBuilds.run_nr,
      branch: baseBranch,
      ref: baseGoodBuilds.head_commit,
    })
  }
  prBuilds.sort((a, b) => (a.distance > b.distance ? 1 : -1))
  if (prBuilds.length > 0)
    return {
      sha: prBuilds[0].hash,
      run_number: prBuilds[0].run_nr,
      branch: prBuilds[0].branch.replace('origin/', ''),
      ref: prBuilds[0].ref,
    }
  return 'rebuild'
}
