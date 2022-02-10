import simpleGit, { SimpleGit } from 'simple-git'
import { mkdtemp, writeFile } from 'fs/promises'
import { join } from 'path'
import {
  findBestGoodRefBranch,
  findBestGoodRefPR,
  GitActionStatus,
} from './change-detection'
import { Substitute, Arg } from '@fluffy-spoon/substitute'

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

const baseBranch = 'main'
const headBranch = 'fix'
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
    let mainGoodBeforeBadSha: string
    let forkSha: string
    let fixFailSha1: string
    let rootSha: string
    let fixGoodSha: string
    beforeEach(async () => {
      const br = await git.checkoutLocalBranch(baseBranch)
      rootSha = await makeChange(git, fileA, 'A-good-[a,b,c]')
      mainGoodBeforeBadSha = await makeChange(git, fileA, 'B-good-[a]')
      forkSha = await makeChange(git, fileA, 'C-bad-[a]')
      await git.checkoutBranch('fix2', baseBranch)
      const fix2Sha = await makeChange(git, fileA, 'C1-bad-[a]')
      await git.checkoutBranch(headBranch, baseBranch)

      const fixFailSha = await makeChange(git, fileB, 'D-bad-[a]')
      fixFailSha1 = await makeChange(git, fileB, 'D2-good-[a]')
      const fixFailSha2 = await makeChange(git, fileB, 'D3-bad-[a]')
      fixGoodSha = await makeChange(git, fileB, 'E-good-[a]')

      await git.checkout(baseBranch)
      const mainSha = await makeChange(git, fileA, 'D1-good-[b]')
      const merge = await git.mergeFromTo(headBranch, baseBranch)
    })
    it('should use last good commit when no PR runs available', async () => {
      const githubApi = Substitute.for<GitActionStatus>()
      githubApi.getPRRuns(100).resolves([])
      githubApi.getBranchBuilds(baseBranch).resolves([])
      githubApi
        .getBranchBuilds('HEAD')
        .resolves([
          { head_commit: mainGoodBeforeBadSha },
          { head_commit: rootSha },
        ])

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        100,
        headBranch,
        baseBranch,
      )
      expect(actual).toBe(mainGoodBeforeBadSha)
    })

    it('should use last good PR when available', async () => {
      const githubApi = Substitute.for<GitActionStatus>()
      githubApi
        .getPRRuns(100)
        .resolves([{ head_commit: fixFailSha1, base_commit: forkSha }])

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        100,
        headBranch,
        baseBranch,
      )
      expect(actual).toBe('123')
    })
  })
  describe('Branch', () => {
    it('should skip bad commit', async () => {
      const br = await git.checkoutLocalBranch(baseBranch)
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

      expect(
        await findBestGoodRefBranch((services) => services.length, git),
      ).toBe(goodBeforeBadSha)
      await makeChange(git, fileA, 'E-[a]')
      expect(
        await findBestGoodRefBranch((services) => services.length, git),
      ).toBe(fixSha)
    })
  })
  describe('Pending', () => {
    it.todo('PR workflow uses build workflow (sharing tests)')
    it.todo('PR workflow uses PR workflow when available')
  })
})
