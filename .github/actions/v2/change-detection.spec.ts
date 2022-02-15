import simpleGit, { SimpleGit } from 'simple-git'
import { mkdtemp, writeFile } from 'fs/promises'
import { join } from 'path'
import {
  findBestGoodRefBranch,
  findBestGoodRefPR,
  GitActionStatus,
} from './change-detection'
import { Substitute, Arg } from '@fluffy-spoon/substitute'
import { existsSync, mkdir, mkdirSync } from 'fs'
import { promisify } from 'util'

let fileA: string
let fileB: string

async function makeChangeWithContent(
  git: SimpleGit,
  changeset: { path: string; content: string }[],
  message: string,
): Promise<string> {
  for (const change of changeset) {
    await writeFile(change.path, change.content)
    await git.add(change.path)
  }
  const commit = await git.commit(
    message,
    changeset.map((c) => c.path),
  )
  return commit.commit
}

const mkdirAsync = promisify(mkdir)

const baseBranch = 'main'
const headBranch = 'fix'
type Component = 'a' | 'b' | 'c' | 'd' | 'e'
describe('Change detection', () => {
  jest.setTimeout(60000)
  let git: SimpleGit
  let path: string
  let makeChange: (
    git: SimpleGit,
    component: Component | Component[],
    message: string,
  ) => Promise<string>
  beforeEach(async () => {
    path = await mkdtemp(`${__dirname}/test-data/repo`)
    fileA = join(path, 'A.txt')
    fileB = join(path, 'B.txt')
    git = simpleGit(path, { baseDir: path })
    const r = await git.init()
    makeChange = async (
      git: SimpleGit,
      component: Component | Component[],
      message: string,
    ): Promise<string> => {
      if (!Array.isArray(component)) {
        component = [component]
      }

      for (const componentElement of component) {
        let compPath = join(path, componentElement)
        if (!existsSync(compPath)) {
          await mkdirAsync(compPath)
        }
      }
      return await makeChangeWithContent(
        git,
        component.map((c) => ({
          path: `${join(path, c)}/${Math.random().toLocaleString()}.txt`,
          content: Math.random().toLocaleString(),
        })),
        message,
      )
    }
  })

  describe('PR', () => {
    let mainGoodBeforeBadSha: string
    let forkSha: string
    let fixFailSha1: string
    let rootSha: string
    let fixGoodSha: string
    let mainSha1: string
    let mainSha2: string
    beforeEach(async () => {
      const br = await git.checkoutLocalBranch(baseBranch)
      rootSha = await makeChange(git, 'a', 'A-good')
      mainGoodBeforeBadSha = await makeChange(git, 'a', 'B-good')
      forkSha = await makeChange(git, 'a', 'C-bad')
      await git.checkoutBranch('fix2', baseBranch)
      const fix2Sha = await makeChange(git, 'a', 'C1-bad')

      await git.checkoutBranch(headBranch, baseBranch)
      const fixFailSha = await makeChange(git, 'b', 'D-bad')
      fixFailSha1 = await makeChange(git, 'b', 'D2-good')
      const fixFailSha2 = await makeChange(git, 'c', 'D3-good')

      fixGoodSha = await makeChange(git, 'b', 'E-good')
      await git.checkout(baseBranch)
      mainSha1 = await makeChange(git, 'd', 'D1-good')
      mainSha2 = await makeChange(git, 'e', 'D2-good')
      await git.mergeFromTo(headBranch, baseBranch)
    })
    it('should use last good commit when no PR runs available', async () => {
      const githubApi = Substitute.for<GitActionStatus>()
      githubApi.getPRRuns(100).resolves([])
      githubApi.getBranchBuilds(baseBranch).resolves([])
      githubApi
        .getBranchBuilds(headBranch)
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
      const PR = 100
      githubApi.getPRRuns(PR).resolves([
        { head_commit: fixGoodSha, base_commit: mainSha1 },
        { head_commit: fixFailSha1, base_commit: forkSha },
      ])

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        PR,
        headBranch,
        baseBranch,
      )
      expect(actual).toBe(fixGoodSha)
    })
  })
  describe('Branch', () => {
    it('should skip bad commit', async () => {
      const br = await git.checkoutLocalBranch(baseBranch)
      const firstGoodSha = await makeChange(git, 'a', 'A-good')
      const goodBeforeBadSha = await makeChange(git, 'a', 'B-good')
      const badSha = await makeChange(git, 'a', 'C-bad')
      const fixSha = await makeChange(git, 'a', 'D-good')
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
      await makeChange(git, 'a', 'E')
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
