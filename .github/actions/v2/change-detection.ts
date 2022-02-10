import { DefaultLogFields, ListLogLine, SimpleGit } from 'simple-git'
import { Workflows } from '@contentful/forma-36-react-components/dist/components/Icon/svg'

const calculateDistance = async (
  git: SimpleGit,
  currentSha: string,
  p: DefaultLogFields & ListLogLine,
) => {
  const changes = await git.log({ from: currentSha, to: p.hash })
  const tree = await git.raw(
    'log',
    '--graph',
    '--pretty=oneline',
    '--abbrev-commit',
  )
  const commits = (
    await git.raw('rev-list', '--date-order', `${currentSha}`, `${p.hash}`)
  )
    .split('\n')
    .filter((s) => s.length > 0)
    .map((c) => c.substr(0, 7))

  const changed = changes.all.flatMap((ch) =>
    ch.message
      .match(/-\[(?<components>.*)\]$/)
      .groups['components'].split(',')
      .map((s) => s.trim()),
  )
  // @ts-ignore
  return [...new Set(changed)]
}

export async function findBestGoodRefBranch(
  commitScore: (services) => number,
  git: SimpleGit,
) {
  const lastChanges = await git.log({ maxCount: 10 })
  const currentChange = lastChanges.latest
  let filterOutBadCommits = (change) => {
    return change.message.indexOf('-bad') == -1
  }

  const goodCommits = lastChanges.all
    .filter((ch) => ch.hash != currentChange.hash)
    .filter(filterOutBadCommits)
    .map((change, idx) =>
      (async () => ({
        change: change,
        idx,
        distance: commitScore(
          await calculateDistance(git, currentChange.hash, change),
        ),
      }))(),
    )
  const goodScoredCommits = await Promise.all(goodCommits)
  goodScoredCommits.sort((a, b) =>
    a.distance == b.distance
      ? a.idx > b.idx
        ? 1
        : -1
      : a.distance > b.distance
      ? 1
      : -1,
  )

  return goodScoredCommits[0].change.hash.substr(0, 7)
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
  const lastChanges = await git.log({ maxCount: 10 })
  const currentChange = lastChanges.latest

  const runs = await githubApi.getPRRuns(prID)
  if (runs.length > 0) {
    const previousRuns = await githubApi.getPRRuns(prID)
    for (const previousRun of previousRuns) {
      const tempBranch = `${headBranch}-${Math.round(Math.random() * 1000)}`
      await git.checkoutBranch(tempBranch, previousRun.base_commit)
      await git.merge({ [`${previousRun.head_commit}`]: null })
      const lastMerge = await git.log({ maxCount: 1 })
      const lastMergeCommit = lastChanges.latest
      const distance = await calculateDistance(
        git,
        currentChange.hash,
        lastMergeCommit,
      )
      return lastMergeCommit.hash
    }
  } else {
    // no pr runs
    const br2 = await git.raw('merge-base', 'main', 'HEAD')
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
