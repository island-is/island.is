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
  const builds = await githubApi.getBranchBuilds(headBranch, commits)
  if (builds.length > 0) return builds[0].head_commit

  const baseCommits = await githubApi.getBranchBuilds(baseBranch, commits)
  if (baseCommits.length > 0) return baseCommits[0].head_commit

  return 'rebuild'
}

export async function findBestGoodRefPR(
  commitScore: (services) => number,
  git: SimpleGit,
  githubApi: GitActionStatus,
  prID: number,
  headBranch: string,
  baseBranch,
): Promise<string | 'rebuild'> {
  const lastChanges = await git.log({ maxCount: 1 })
  const currentChange = lastChanges.latest

  const runs = await githubApi.getPRRuns(prID)
  if (runs.length > 0) {
    const distances: { distance: number; hash: string }[] = []
    for (const previousRun of runs) {
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
      distances.push({
        distance: commitScore(distance),
        hash: previousRun.head_commit,
      })
    }
    distances.sort((a, b) => (a.distance > b.distance ? 1 : -1))
    return distances[0].hash
  } else {
    // no pr runs
    const br2 = await git.raw('merge-base', baseBranch, headBranch)
    // return br2.trim()
    const commits = (
      await git.raw('rev-list', '--date-order', 'HEAD~1', `${br2.trim()}`)
    )
      .split('\n')
      .filter((s) => s.length > 0)
      .map((c) => c.substr(0, 7))
    const baseGoodBuilds = await githubApi.getBranchBuilds(baseBranch, commits)
    const headGoodBuilds = await githubApi.getBranchBuilds(headBranch, commits)

    for (const commit of commits) {
      if (baseGoodBuilds.filter((b) => commit === b.head_commit).length > 0)
        return commit
      if (headGoodBuilds.filter((b) => commit === b.head_commit).length > 0)
        return commit
    }
    return 'rebuild'
  }
}
