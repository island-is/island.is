import simpleGit, { SimpleGit } from 'simple-git'
import { writeFile, mkdtemp } from 'fs/promises'
import { join } from 'path'

let fileA: string

async function makeChange(
  git: SimpleGit,
  path: string,
  content: string,
  message: string,
) {
  await writeFile(path, content)
  await git.add(path)
  await git.commit(message, [path])
}

describe('Change detection', () => {
  describe('linear change', () => {
    let git: SimpleGit
    let path: string
    beforeEach(async () => {
      path = await mkdtemp(`${__dirname}/test-data/repo`)
      fileA = join(path, 'A.txt')
      git = simpleGit(path, { baseDir: path })
      const r = await git.init()
    })
    it('should skip bad commit', async () => {
      await makeChange(git, fileA, 'test1', 'A-good')
      await makeChange(git, fileA, 'test2', 'B-bad')
      await makeChange(git, fileA, 'test3', 'C')
      const logs = await git.log({ format: {} })
      expect(logs.total).toBe(3)
    })
  })
})
