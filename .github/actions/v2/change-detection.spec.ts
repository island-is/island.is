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
  describe('linear change', () => {
    let git: SimpleGit
    let path: string
    beforeEach(async () => {
      path = await mkdtemp(`${__dirname}/test-data/repo`)
      fileA = join(path, 'A.txt')
      fileB = join(path, 'B.txt')
      git = simpleGit(path, { baseDir: path })
      const r = await git.init()
    })
    it('should skip bad commit', async () => {
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
})
