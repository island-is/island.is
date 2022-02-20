import { SimpleGit } from 'simple-git'
import { GitActionStatus } from './git-action-status'
import debug from 'debug'

const gitLog = debug('git')
const logMethod1 = debug('findBestGoodRefBranch')
type LastGoodBuild =
  | {
      sha: string
      run_number: number
      branch: string
    }
  | 'rebuild'

export async function findBestGoodRefBranch(
  commitScore: (services) => number,
  git: SimpleGit,
  githubApi: GitActionStatus,
  headBranch: string,
  baseBranch: string,
): Promise<LastGoodBuild> {
  logMethod1(
    `Starting with head branch ${headBranch} and base branch ${baseBranch}`,
  )
  const mergeCommit = await git.raw('merge-base', baseBranch, headBranch)
  gitLog(`Merge commit is ${mergeCommit}`)
  const commits = (
    await git.raw('rev-list', '--date-order', 'HEAD~1', `${mergeCommit.trim()}`)
  )
    .split('\n')
    .filter((s) => s.length > 0)
    .map((c) => c.substr(0, 7))
  const builds = await githubApi.getLastGoodBranchBuildRun(headBranch, commits)
  if (builds)
    return {
      sha: builds.head_commit,
      run_number: builds.run_nr,
      branch: headBranch,
    }

  const baseCommits = await githubApi.getLastGoodBranchBuildRun(
    baseBranch,
    commits,
  )
  if (baseCommits)
    return {
      sha: baseCommits.head_commit,
      run_number: baseCommits.run_nr,
      branch: baseBranch,
    }

  return 'rebuild'
}

export async function findBestGoodRefPR(
  diffWeight: (services) => number,
  git: SimpleGit,
  githubApi: GitActionStatus,
  headBranch: string,
  baseBranch: string,
): Promise<LastGoodBuild> {
  const lastChanges = await git.log({ maxCount: 1 })
  const currentChange = lastChanges.latest

  const runs = await githubApi.getLastGoodPRRun(headBranch)
  const prBuilds: {
    distance: number
    hash: string
    run_nr: number
    branch: string
  }[] = []
  if (runs) {
    try {
      const previousRun = runs
      const tempBranch = `${headBranch}-${Math.round(Math.random() * 1000000)}`
      await git.checkoutBranch(tempBranch, previousRun.base_commit)
      await git.merge({ [previousRun.head_commit]: null })
      const lastMerge = await git.log({ maxCount: 1 })
      const lastMergeCommit = lastMerge.latest
      const distance = await githubApi.calculateDistance(
        git,
        currentChange.hash,
        lastMergeCommit.hash,
      )
      prBuilds.push({
        distance: diffWeight(distance),
        hash: previousRun.head_commit,
        run_nr: previousRun.run_nr,
        branch: headBranch,
      })
    } finally {
      await git.checkout(headBranch)
    }
  }
  const mergeBaseCommit = await git.raw('merge-base', baseBranch, headBranch)
  const commits = (
    await git.raw(
      'rev-list',
      '--date-order',
      'HEAD~1',
      `${mergeBaseCommit.trim()}`,
    )
  )
    .split('\n')
    .filter((s) => s.length > 0)
    .map((c) => c.substr(0, 7))
  const baseGoodBuilds = await githubApi.getLastGoodBranchBuildRun(
    baseBranch,
    commits,
  )
  if (baseGoodBuilds) {
    let affectedComponents = await githubApi.calculateDistance(
      git,
      currentChange.hash,
      baseGoodBuilds.head_commit,
    )
    prBuilds.push({
      distance: diffWeight(affectedComponents),
      hash: baseGoodBuilds.head_commit,
      run_nr: baseGoodBuilds.run_nr,
      branch: baseBranch,
    })
  }
  prBuilds.sort((a, b) => (a.distance > b.distance ? 1 : -1))
  if (prBuilds.length > 0)
    return {
      sha: prBuilds[0].hash,
      run_number: prBuilds[0].run_nr,
      branch: prBuilds[0].branch,
    }
  return 'rebuild'
}
