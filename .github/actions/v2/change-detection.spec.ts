import simpleGit, { DefaultLogFields, ListLogLine, SimpleGit } from 'simple-git'
import { writeFile, mkdtemp } from 'fs/promises'
import { join } from 'path'
import { Simulate } from 'react-dom/test-utils'
import change = Simulate.change

let fileA: string
let fileB: string

async function makeChange(
  git: SimpleGit,
  path: string,
  content: string,
  message: string,
): Promise<string> {
  await writeFile(path, content)
  await git.add(path)
  const commit = await git.commit(message, [path])
  return commit.commit
}

interface GitActionStatus {}
async function findBestGoodRef(
  mergeCommitSha: string,
  commitScore: (services) => number,
  git: SimpleGit,
) {
  const lastChanges = await git.log({ maxCount: 10 })
  const currentChange = lastChanges.latest
  let filterOutBadCommits = (change) => {
    return change.message.indexOf('-bad') == -1
  }

  const calculateDistance = async (p: DefaultLogFields & ListLogLine) => {
    const changes = await git.log({ from: currentChange.hash, to: p.hash })
    const changed = changes.all.flatMap((ch) =>
      ch.message
        .match(/\[(?<components>.*)\]/)
        .groups['components'].split(',')
        .map((s) => s.trim()),
    )
    // @ts-ignore
    return [...new Set(changed)]
  }

  const goodCommits = lastChanges.all
    .filter((ch) => ch.hash != currentChange.hash)
    .filter(filterOutBadCommits)
    .map((change, idx) =>
      (async () => ({
        change: change,
        idx,
        distance: commitScore(await calculateDistance(change)),
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

describe('Change detection', () => {
  jest.setTimeout(60000)
  let git: SimpleGit
  let path: string
  beforeEach(async () => {
    path = await mkdtemp(`${__dirname}/test-data/repo`)
    fileA = join(path, 'A.txt')
    fileB = join(path, 'B.txt')
    git = simpleGit(path, { baseDir: path })
    const r = await git.init()
  })
  describe('linear change', () => {
    xit('should skip bad commit', async () => {
      const br = await git.checkoutLocalBranch('main')
      await makeChange(git, fileA, 'test1', 'A-good')
      const forkSha = await makeChange(git, fileA, 'test2', 'B-bad')
      await git.checkoutBranch('fix', 'main')
      const fixSha = await makeChange(git, fileB, 'test3', 'C')
      await git.checkout('main')
      const mainSha = await makeChange(git, fileA, 'test3', 'D-good')
      const merge = await git.mergeFromTo('fix', 'main')

      const br2 = await git.raw('merge-base', 'fix', 'main')

      const logs = await git.log({ format: {} })
      expect(logs.total).toBe(5)
    })
  })
  describe('PR', () => {
    it('should skip bad commit', async () => {
      const br = await git.checkoutLocalBranch('main')
      const rootSha = await makeChange(git, fileA, 'test', 'A-good-[a,b,c]')
      const commonSha = await makeChange(git, fileA, 'test1', 'B-good-[a]')
      const forkSha = await makeChange(git, fileA, 'test2', 'C-bad-[b]')
      const mainSha = await makeChange(git, fileA, 'test3', 'E-good-[a,c]')
      const mergeCommitSha = (await git.log({ maxCount: 1 })).latest.hash
      // const br2 = await git.raw('merge-base', fixSha, 'main')
      const commits = await git.raw(
        'rev-list',
        '--all',
        mergeCommitSha,
        `${commonSha}~`,
      )

      const sha = await findBestGoodRef(
        mergeCommitSha,
        (services) => services.length,
        git,
      )
      expect(sha).toBe(commonSha)
    })
  })
})
