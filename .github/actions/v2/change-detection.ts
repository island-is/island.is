// import { SimpleGit } from 'simple-git'
import { SimpleGit } from './simple-git'
import { GitActionStatus } from './git-action-status'
import Debug from 'debug'
import { execSync } from 'child_process'

const app = Debug('change-detection')
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
  const log = app.extend('findBestGoodRefBranch')
  log(`Starting with head branch ${headBranch} and base branch ${baseBranch}`)
  const mergeCommit = await git.raw('merge-base', baseBranch, headBranch)
  app(`Merge commit is ${mergeCommit}`)
  const commits = (
    await git.raw(
      'rev-list',
      '--date-order',
      '--max-count=50',
      'HEAD~1',
      `${mergeCommit.trim()}`,
    )
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
  prBranch,
): Promise<LastGoodBuild> {
  const log = app.extend('findBestGoodRefPR')
  log(`Starting with head branch ${headBranch} and base branch ${baseBranch}`)
  const lastChanges = await git.log({ maxCount: 1 })
  const currentChange = lastChanges.latest

  const prRun = await githubApi.getLastGoodPRRun(headBranch)
  const prBuilds: {
    distance: number
    hash: string
    run_nr: number
    branch: string
  }[] = []
  if (prRun) {
    log(`Found a PR run candidate: ${JSON.stringify(prRun)}`)
    execSync(`which git; whoami; which sh`, { stdio: 'inherit' })
    try {
      const tempBranch = `${headBranch}-${Math.round(Math.random() * 1000000)}`
      await git.checkoutBranch(tempBranch, prRun.base_commit)
      log(`Branch checked out`)
      execSync(`which git; whoami`, { stdio: 'inherit' })
      await git.merge(prRun.head_commit)
      execSync(`which git; whoami`, { stdio: 'inherit' })
      log(`Simulated previous PR merge commit`)
      const lastMerge = await git.log({ maxCount: 1 })
      const lastMergeCommit = lastMerge.latest
      const distance = await githubApi.calculateDistance(
        git,
        currentChange.hash,
        lastMergeCommit.hash,
      )
      log(`Affected components since candidate PR run are ${distance}`)
      prBuilds.push({
        distance: diffWeight(distance),
        hash: prRun.head_commit,
        run_nr: prRun.run_nr,
        branch: headBranch,
      })
    } finally {
      await git.checkout(prBranch)
    }
  }
  const mergeBaseCommit = await git.raw('merge-base', prBranch, baseBranch)
  const commits = (
    await git.raw(
      'rev-list',
      '--date-order',
      '--max-count=50',
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
      branch: prBuilds[0].branch.replace('origin/', ''),
    }
  return 'rebuild'
}
