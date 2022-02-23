// import simpleGit, { SimpleGit } from 'simple-git'
import { mkdtemp, writeFile } from 'fs/promises'
import { join } from 'path'
import { findBestGoodRefBranch, findBestGoodRefPR } from './change-detection'
import { Arg, Substitute, SubstituteOf } from '@fluffy-spoon/substitute'
import { existsSync, mkdir } from 'fs'
import { promisify } from 'util'
import { GitActionStatus } from './git-action-status'
import { SimpleGit } from './simple-git'
import { execSync } from 'child_process'

const baseBranch = 'main'
const headBranch = 'fix'
const prBranch = 'pr'
type Component = 'a' | 'b' | 'c' | 'd' | 'e'

describe('Change detection', () => {
  jest.setTimeout(60000)
  let git: SimpleGit
  let path: string
  let githubApi: SubstituteOf<GitActionStatus>
  let makeChange: (
    git: SimpleGit,
    component: Component | Component[],
    message: string,
  ) => Promise<string>
  beforeEach(async () => {
    path = await mkdtemp(`${__dirname}/test-data/repo`)
    git = new SimpleGit(path)
    const r = await git.git('init', '.')
    githubApi = Substitute.for<GitActionStatus>()
    githubApi.calculateDistance(Arg.all()).mimicks(calculateDistance)

    makeChange = async (
      git: SimpleGit,
      component: Component | Component[],
      message: string,
    ): Promise<string> => {
      return await makeChangeGlobal(component, path, git, message)
    }
  })

  describe('PR', () => {
    let mainGoodBeforeBadSha: string
    let fixGoodSha: string
    let mainSha1: string
    let majorChangeSha: string
    let f1: string
    let f2: string
    let f3: string
    beforeEach(async () => {
      await git.checkoutLocalBranch(baseBranch)
      await makeChange(git, 'a', 'A-good')
      mainGoodBeforeBadSha = await makeChange(git, 'a', 'B-good')
      await makeChange(git, 'a', 'C-bad')
      await git.checkoutBranch('fix2', baseBranch)
      await makeChange(git, 'a', 'C1-bad')

      await git.checkoutBranch(headBranch, baseBranch)
      f1 = await makeChange(git, 'b', 'D-bad')
      f2 = await makeChange(git, 'b', 'D2-good')
      f3 = await makeChange(git, 'c', 'D3-good')

      fixGoodSha = await makeChange(git, 'b', 'E-good')
      await git.checkout(baseBranch)
      mainSha1 = await makeChange(git, 'd', 'D1-good')
      majorChangeSha = await makeChange(
        git,
        ['a', 'b', 'c', 'd', 'e'],
        'D2-good',
      )
      await git.checkoutBranch(prBranch, headBranch)
      await git.mergeFromTo(baseBranch, prBranch)
    })
    it('should use last good branch run when no PR runs available', async () => {
      githubApi.getLastGoodPRRun(headBranch).resolves(undefined)
      githubApi
        .getLastGoodBranchBuildRun(
          baseBranch,
          Arg.is((commits) => commits.includes(mainGoodBeforeBadSha)),
        )
        .resolves({ head_commit: mainGoodBeforeBadSha, run_nr: 2 })

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        headBranch,
        baseBranch,
        prBranch,
      )
      expect(actual).toStrictEqual({
        sha: mainGoodBeforeBadSha,
        run_number: 2,
        branch: baseBranch,
      })
    })

    it('should use PR run when available', async () => {
      githubApi
        .getLastGoodPRRun(headBranch)
        .resolves({ head_commit: fixGoodSha, base_commit: mainSha1, run_nr: 2 })
      githubApi
        .getLastGoodBranchBuildRun(baseBranch, Arg.any())
        .resolves(undefined)

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        headBranch,
        baseBranch,
        prBranch,
      )
      expect(actual).toStrictEqual({
        sha: fixGoodSha,
        run_number: 2,
        branch: headBranch,
      })
    })
    it('prefer lighter branch run over heavier PR run', async () => {
      githubApi
        .getLastGoodPRRun(headBranch)
        .resolves({ head_commit: fixGoodSha, base_commit: mainSha1, run_nr: 2 })
      githubApi
        .getLastGoodBranchBuildRun(
          baseBranch,
          Arg.is((commits) => commits.includes(majorChangeSha)),
        )
        .resolves({ head_commit: majorChangeSha, run_nr: 3 })

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        headBranch,
        baseBranch,
        prBranch,
      )
      expect(actual).toStrictEqual({
        sha: majorChangeSha,
        run_number: 3,
        branch: baseBranch,
      })
    })
    it('should trigger a full rebuild if no good commits found neither on PR nor on base branch', async () => {
      githubApi.getLastGoodPRRun(headBranch).resolves(undefined)
      githubApi
        .getLastGoodBranchBuildRun(baseBranch, Arg.any())
        .resolves(undefined)

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        headBranch,
        baseBranch,
        prBranch,
      )
      expect(actual).toBe('rebuild')
    })
  })
  describe('PR to release branch', () => {
    let mainGoodBeforeBadSha: string
    let fixGoodSha: string
    let mainSha1: string
    let majorChangeSha: string
    const mainBranch = 'main'
    const baseBranch = 'release-13.2.0'
    const prBranch = 'pr'
    let hotfix1: string
    beforeEach(async () => {
      await git.checkoutLocalBranch(mainBranch)
      mainGoodBeforeBadSha = await makeChange(git, 'a', 'A-good')
      await makeChange(git, 'a', 'C-bad')
      await git.checkoutBranch(baseBranch, mainBranch)
      hotfix1 = await makeChange(git, 'a', 'C1-bad')

      await git.checkoutBranch(headBranch, baseBranch)
      await makeChange(git, 'b', 'D-bad')
      await makeChange(git, 'b', 'D2-good')
      await makeChange(git, 'c', 'D3-good')

      fixGoodSha = await makeChange(git, 'b', 'E-good')
      await git.checkout(baseBranch)
      mainSha1 = await makeChange(git, 'd', 'D1-good')
      majorChangeSha = await makeChange(
        git,
        ['a', 'b', 'c', 'd', 'e'],
        'D2-good',
      )
      await git.checkoutBranch(prBranch, headBranch)
      await git.mergeFromTo(baseBranch, prBranch)
    })
    it('should use last good branch from main when no good runs on base or head branch', async () => {
      githubApi.getLastGoodPRRun(headBranch).resolves(undefined)
      githubApi
        .getLastGoodBranchBuildRun(
          baseBranch,
          Arg.is((commits) => commits.includes(mainGoodBeforeBadSha)),
        )
        .resolves({ head_commit: mainGoodBeforeBadSha, run_nr: 2 })

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        headBranch,
        baseBranch,
        prBranch,
      )
      expect(actual).toStrictEqual({
        sha: mainGoodBeforeBadSha,
        run_number: 2,
        branch: baseBranch,
      })
    })

    it('should prefer the lighter run between a PR run a base branch run', async () => {
      githubApi
        .getLastGoodPRRun(headBranch)
        .resolves({ head_commit: fixGoodSha, base_commit: hotfix1, run_nr: 2 })
      githubApi
        .getLastGoodBranchBuildRun(
          baseBranch,
          Arg.is((commits) => commits.includes(majorChangeSha)),
        )
        .resolves({ head_commit: majorChangeSha, run_nr: 3 })

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        headBranch,
        baseBranch,
        prBranch,
      )
      expect(actual).toStrictEqual({
        sha: majorChangeSha,
        run_number: 3,
        branch: baseBranch,
      })
    })
    it('prefer lighter branch run over heavier PR run', async () => {
      githubApi
        .getLastGoodPRRun(headBranch)
        .resolves({ head_commit: fixGoodSha, base_commit: mainSha1, run_nr: 2 })
      githubApi
        .getLastGoodBranchBuildRun(
          baseBranch,
          Arg.is((commits) => commits.includes(majorChangeSha)),
        )
        .resolves({ head_commit: majorChangeSha, run_nr: 3 })

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        headBranch,
        baseBranch,
        prBranch,
      )
      expect(actual).toStrictEqual({
        sha: majorChangeSha,
        run_number: 3,
        branch: baseBranch,
      })
    })
  })
  describe('Release branch', () => {
    const headBranch = 'release-13.3.0'
    let goodBeforeBadSha: string
    let hotfix1: string
    beforeEach(async () => {
      await git.checkoutLocalBranch(baseBranch)
      await makeChange(git, 'a', 'A-good')
      goodBeforeBadSha = await makeChange(git, 'a', 'B-good')
      await makeChange(git, 'a', 'C-bad')
      await makeChange(git, 'a', 'D-good')
      await git.checkoutBranch(headBranch, baseBranch)
      hotfix1 = await makeChange(git, 'b', 'D-bad')
      await makeChange(git, 'b', 'D2-good')
      await makeChange(git, 'c', 'D3-good')
    })
    it('should prefer head branch commits over base branch ones', async () => {
      githubApi
        .getLastGoodBranchBuildRun(baseBranch, Arg.any())
        .resolves({ head_commit: goodBeforeBadSha, run_nr: 1 })
      githubApi
        .getLastGoodBranchBuildRun(
          headBranch,
          Arg.is((commits) => commits.includes(hotfix1)),
        )
        .resolves({ head_commit: hotfix1, run_nr: 2 })

      expect(
        await findBestGoodRefBranch(
          (services) => services.length,
          git,
          githubApi,
          headBranch,
          baseBranch,
        ),
      ).toStrictEqual({ sha: hotfix1, run_number: 2, branch: headBranch })
    })
    it('should take base branch commits if no good on head branch', async () => {
      githubApi
        .getLastGoodBranchBuildRun(baseBranch, Arg.any())
        .resolves({ head_commit: goodBeforeBadSha, run_nr: 1 })
      githubApi
        .getLastGoodBranchBuildRun(headBranch, Arg.any())
        .resolves(undefined)

      expect(
        await findBestGoodRefBranch(
          (services) => services.length,
          git,
          githubApi,
          headBranch,
          baseBranch,
        ),
      ).toStrictEqual({
        sha: goodBeforeBadSha,
        run_number: 1,
        branch: baseBranch,
      })
    })
    it('should trigger a full rebuild if no good commits found neither on head nor base branch', async () => {
      githubApi
        .getLastGoodBranchBuildRun(baseBranch, Arg.any())
        .resolves(undefined)

      expect(
        await findBestGoodRefBranch(
          (services) => services.length,
          git,
          githubApi,
          baseBranch,
          baseBranch,
        ),
      ).toBe('rebuild')
    })
  })
  describe('Main branch', () => {
    const headBranch = baseBranch
    let goodBeforeBadSha: string
    beforeEach(async () => {
      await git.checkoutLocalBranch(baseBranch)
      await makeChange(git, 'a', 'A-good')
      goodBeforeBadSha = await makeChange(git, 'a', 'B-good')
      await makeChange(git, 'a', 'C-bad')
      await makeChange(git, 'a', 'D-good')
    })
    it('should take last good branch build', async () => {
      githubApi
        .getLastGoodBranchBuildRun(baseBranch, Arg.any())
        .resolves({ head_commit: goodBeforeBadSha, run_nr: 1 })

      expect(
        await findBestGoodRefBranch(
          (services) => services.length,
          git,
          githubApi,
          headBranch,
          baseBranch,
        ),
      ).toStrictEqual({
        sha: goodBeforeBadSha,
        run_number: 1,
        branch: baseBranch,
      })
    })
    it('should trigger a full rebuild if no good commits found neither on head nor base branch', async () => {
      githubApi
        .getLastGoodBranchBuildRun(baseBranch, Arg.any())
        .resolves(undefined)

      expect(
        await findBestGoodRefBranch(
          (services) => services.length,
          git,
          githubApi,
          baseBranch,
          baseBranch,
        ),
      ).toBe('rebuild')
    })
  })
})

async function calculateDistance(
  git: SimpleGit,
  currentSha: string,
  olderSha: string,
): Promise<string[]> {
  const diffNames = await git.git('diff', '--name-status', currentSha, olderSha)
  return [
    // @ts-ignore
    ...new Set(
      diffNames
        .split('\n')
        .map((l) => l.replace('D\t', '').trim().split('/')[0])
        .filter((s) => s.length > 0),
    ),
  ]
}

const mkdirAsync = promisify(mkdir)

async function makeChangeWithContent(
  git: SimpleGit,
  changeset: { path: string; content: string }[],
  message: string,
): Promise<string> {
  for (const change of changeset) {
    await writeFile(change.path, change.content)
    await git.add(change.path)
  }
  const commit = await git.commit(message)
  return commit.slice(0, 7)
}

async function makeChangeGlobal(
  component: 'a' | 'b' | 'c' | 'd' | 'e' | Component[],
  path: string,
  git: SimpleGit,
  message: string,
) {
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
