import { SimpleGit } from 'simple-git'
import { GitActionStatus } from './git-action-status'

export async function findBestGoodRefBranch(
  commitScore: (services) => number,
  git: SimpleGit,
  githubApi: GitActionStatus,
  headBranch: string,
  baseBranch: string,
): Promise<string | 'rebuild'> {
  const br2 = await git.raw('merge-base', baseBranch, headBranch)
  const commits = (
    await git.raw('rev-list', '--date-order', 'HEAD~1', `${br2.trim()}`)
  )
    .split('\n')
    .filter((s) => s.length > 0)
    .map((c) => c.substr(0, 7))
  const builds = await githubApi.getLastGoodBranchBuildRun(headBranch, commits)
  if (builds) return builds.head_commit

  const baseCommits = await githubApi.getLastGoodBranchBuildRun(
    baseBranch,
    commits,
  )
  if (baseCommits) return baseCommits.head_commit

  return 'rebuild'
}

export async function findBestGoodRefPR(
  diffWeight: (services) => number,
  git: SimpleGit,
  githubApi: GitActionStatus,
  headBranch: string,
  baseBranch: string,
): Promise<string | 'rebuild'> {
  const lastChanges = await git.log({ maxCount: 1 })
  const currentChange = lastChanges.latest

  const runs = await githubApi.getLastGoodPRRun(headBranch)
  const prBuilds: { distance: number; hash: string; run_nr: number }[] = []
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
    })
  }
  prBuilds.sort((a, b) => (a.distance > b.distance ? 1 : -1))
  if (prBuilds.length > 0) return prBuilds[0].hash
  return 'rebuild'
}
