import simpleGit, { DefaultLogFields, ListLogLine, SimpleGit } from 'simple-git'

const calculateDistance = async (
  git: SimpleGit,
  currentSha: string,
  p: DefaultLogFields & ListLogLine,
) => {
  const diffNames = await git.diff({
    '--name-status': null,
    [currentSha]: null,
    [p.hash]: null,
  })
  return [
    // @ts-ignore
    ...new Set(
      diffNames
        .split('\n')
        .map((l) => l.replace('D\t', '').trim().split('/')[0])
        .filter((s) => s.length > 0),
    ),
  ]
}

export async function findBestGoodRefBranch(
  commitScore: (services) => number,
  git: SimpleGit,
  githubApi: GitActionStatus,
  branch: string,
  baseBranch: string,
): Promise<string | 'rebuild'> {
  const commits = await githubApi.getBranchBuilds(branch)
  if (commits.length > 0) return commits[0].head_commit
  const baseCommits = await githubApi.getBranchBuilds(baseBranch)

  return baseCommits.length > 0 ? baseCommits[0].head_commit : 'rebuild'
}

interface PRWorkflow {
  head_commit: string
  base_commit: string
}

interface BranchWorkflow {
  head_commit: string
}

export interface GitActionStatus {
  getPRRuns(prID: number): Promise<PRWorkflow[]>
  getBranchBuilds(branch: string): Promise<BranchWorkflow[]>
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
    const previousRuns = await githubApi.getPRRuns(prID)
    const distances: { distance: number; hash: string }[] = []
    for (const previousRun of previousRuns) {
      const tempBranch = `${headBranch}-${Math.round(Math.random() * 1000000)}`
      await git.checkoutBranch(tempBranch, previousRun.base_commit)
      await git.merge({ [previousRun.head_commit]: null })
      const lastMerge = await git.log({ maxCount: 1 })
      const lastMergeCommit = lastMerge.latest
      const distance = await calculateDistance(
        git,
        currentChange.hash,
        lastMergeCommit,
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
    const baseGoodBuilds = await githubApi.getBranchBuilds(baseBranch)
    const headGoodBuilds = await githubApi.getBranchBuilds(headBranch)

    for (const commit of commits) {
      if (baseGoodBuilds.filter((b) => commit === b.head_commit).length > 0)
        return commit
      if (headGoodBuilds.filter((b) => commit === b.head_commit).length > 0)
        return commit
    }
    return 'rebuild'
  }
}
