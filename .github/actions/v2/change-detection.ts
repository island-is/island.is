import { DefaultLogFields, ListLogLine, SimpleGit } from 'simple-git'
import { Workflows } from '@contentful/forma-36-react-components/dist/components/Icon/svg'

const calculateDistance = async (
  git: SimpleGit,
  currentSha: string,
  p: DefaultLogFields & ListLogLine,
) => {
  const changes = await git.log({ from: currentSha, to: p.hash })
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

interface WorkflowInfo {}

interface PRWorkflow {
  head_commit: string
  base_commit: string
}

interface BranchWorkflow {
  head_commit: string
}

export interface GitActionStatus {
  getPRRuns(prID: number): Promise<WorkflowInfo[]>
}

export async function findBestGoodRefPR(
  commitScore: (services) => number,
  git: SimpleGit,
  githubApi: GitActionStatus,
  prID: number,
) {
  const lastChanges = await git.log({ maxCount: 10 })
  const currentChange = lastChanges.latest

  const runs = await githubApi.getPRRuns(prID)
  if (runs.length > 0) {
    throw new Error('not implemented')
  } else {
    // no pr runs
    const br2 = await git.raw('merge-base', 'main', 'HEAD')
    // return br2.trim()
    const commits = (
      await git.raw('rev-list', '--date-order', 'HEAD~1', `${br2.trim()}`)
    )
      .split('\n')
      .filter((s) => s.length > 0)
    return commits[0]
  }
}
