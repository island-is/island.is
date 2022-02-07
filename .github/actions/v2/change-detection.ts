import { DefaultLogFields, ListLogLine, SimpleGit } from 'simple-git'

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

export async function findBestGoodRef(
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
