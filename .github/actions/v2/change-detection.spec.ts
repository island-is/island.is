import simpleGit, { SimpleGit } from 'simple-git'
import { mkdtemp, writeFile } from 'fs/promises'
import { join } from 'path'
import { findBestGoodRef } from './change-detection'

let fileA: string
let fileB: string

async function makeChangeWithContent(
  git: SimpleGit,
  path: string,
  message: string,
  content: string,
): Promise<string> {
  await writeFile(path, content)
  await git.add(path)
  const commit = await git.commit(message, [path])
  return commit.commit
}
async function makeChange(
  git: SimpleGit,
  path: string,
  message: string,
): Promise<string> {
  return makeChangeWithContent(
    git,
    path,
    message,
    Math.random().toLocaleString(),
  )
}

interface GitActionStatus {}

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
  describe('PR', () => {
    xit('should skip bad commit', async () => {
      const br = await git.checkoutLocalBranch('main')
      await makeChange(git, fileA, 'A-good-[a,b,c]')
      await makeChange(git, fileA, 'B-good-[a]')
      const forkSha = await makeChange(git, fileA, 'C-bad-[a]')
      await git.checkoutBranch('fix', 'main')
      const fixFailSha = await makeChange(git, fileB, 'D-bad-[a]')
      const fixGoodSha = await makeChange(git, fileB, 'E-good-[a]')
      await git.checkout('main')
      const mainSha = await makeChange(git, fileA, 'D1-good-[b]')
      const merge = await git.mergeFromTo('fix', 'main')

      const br2 = await git.raw('merge-base', 'fix', 'main')

      expect(await findBestGoodRef((services) => services.length, git)).toBe(
        mainSha,
      )

      const logs = await git.log({ format: {} })
      expect(logs.total).toBe(5)
    })
  })
  describe('Branch', () => {
    it('should skip bad commit', async () => {
      const br = await git.checkoutLocalBranch('main')
      const firstGoodSha = await makeChange(git, fileA, 'A-good-[a,b,c]')
      const goodBeforeBadSha = await makeChange(git, fileA, 'B-good-[a]')
      const badSha = await makeChange(git, fileA, 'C-bad-[b]')
      const fixSha = await makeChange(git, fileA, 'D-good-[a,c]')
      // const mergeCommitSha = (await git.log({ maxCount: 1 })).latest.hash
      // const br2 = await git.raw('merge-base', fixSha, 'main')
      // const commits = await git.raw(
      //   'rev-list',
      //   '--all',
      //   mergeCommitSha,
      //   `${goodBeforeBadSha}~`,
      // )

      expect(await findBestGoodRef((services) => services.length, git)).toBe(
        goodBeforeBadSha,
      )
      await makeChange(git, fileA, 'E-[a]')
      expect(await findBestGoodRef((services) => services.length, git)).toBe(
        fixSha,
      )
    })
  })
})
