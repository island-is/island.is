import simpleGit, { SimpleGit } from 'simple-git'
import { writeFile, mkdtemp } from 'fs/promises'
import { join } from 'path'

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

describe('Change detection', () => {
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
      await git.checkoutBranch('fix', 'main')
      const fixSha = await makeChange(git, fileB, 'test4', 'D-good-[b]')
      await git.checkout('main')
      const mainSha = await makeChange(git, fileA, 'test3', 'E-good-[a,c]')
      const merge = await git.mergeFromTo('fix', 'main')
      const mergeCommitSha = (await git.log({ maxCount: 1 })).latest.hash
      // const br2 = await git.raw('merge-base', fixSha, 'main')
      const commits = await git.raw(
        'rev-list',
        '--all',
        mergeCommitSha,
        `${commonSha}~`,
      )

      const sha = findBestGoodRef(mergeCommitSha, (services) => services.length)
      expect(sha).toBe()
    })
  })
})
