import { mkdtemp, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import {
  findBestGoodRefBranch,
  findBestGoodRefPR,
  Incremental,
} from './change-detection'
import { Arg, Substitute, SubstituteOf } from '@fluffy-spoon/substitute'
import { existsSync, mkdir } from 'fs'
import { promisify } from 'util'
import { GitActionStatus } from './git-action-status'
import { SimpleGit } from './simple-git'

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
    path = await mkdtemp(`${tmpdir()}/repo`)
    git = new SimpleGit(path, process.env.SHELL)
    const r = await git.init()
    githubApi = Substitute.for<GitActionStatus>()
    githubApi.getChangedComponents(Arg.all()).mimicks(getChangedComponents)

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
    let forkSha: string
    let mergeSha: string
    beforeEach(async () => {
      await git.checkoutLocalBranch(baseBranch)
      await makeChange(git, 'a', 'A-good')
      mainGoodBeforeBadSha = await makeChange(git, 'a', 'B-good')
      forkSha = await makeChange(git, 'a', 'C-bad')
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
      await git.checkoutBranch('pr1', mainSha1)
      mergeSha = await git.merge(fixGoodSha)

      await git.checkoutBranch(prBranch, baseBranch)
      await git.mergeFromTo(headBranch, prBranch)
    })
    it('should use last good branch run when no PR runs available', async () => {
      githubApi
        .getLastGoodPRRun(headBranch, 'pullrequest', Arg.any())
        .resolves(undefined)
      githubApi
        .getLastGoodBranchBuildRun(
          baseBranch,
          'push',
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
        'pullrequest',
      )
      expect(actual).toStrictEqual({
        sha: mainGoodBeforeBadSha,
        run_number: 2,
        branch: baseBranch,
        ref: mainGoodBeforeBadSha,
      })
    })

    it('should use PR run when available', async () => {
      githubApi
        .getLastGoodPRRun(
          headBranch,
          'pullrequest',
          Arg.is(
            (commits) =>
              commits.includes(fixGoodSha) && commits.includes(mainSha1),
          ),
        )
        .resolves({ head_commit: fixGoodSha, base_commit: mainSha1, run_nr: 2 })
      githubApi
        .getLastGoodBranchBuildRun(baseBranch, 'push', Arg.any())
        .resolves(undefined)

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        headBranch,
        baseBranch,
        prBranch,
        'pullrequest',
      )

      expect(actual).toMatchObject({
        sha: fixGoodSha,
        run_number: 2,
        branch: headBranch,
      })
      expect(
        await getChangedComponents(git, (actual as Incremental).ref, mergeSha),
      ).toStrictEqual([])
    })
    it('prefer lighter branch run over heavier PR run', async () => {
      githubApi
        .getLastGoodPRRun(
          headBranch,
          'pullrequest',
          Arg.is(
            (commits) =>
              commits.includes(fixGoodSha) && commits.includes(mainSha1),
          ),
        )
        .resolves({ head_commit: fixGoodSha, base_commit: mainSha1, run_nr: 2 })
      githubApi
        .getLastGoodBranchBuildRun(
          baseBranch,
          'push',
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
        'pullrequest',
      )
      expect(actual).toMatchObject({
        sha: majorChangeSha,
        run_number: 3,
        branch: baseBranch,
        ref: majorChangeSha,
      })
    })
    it('should trigger a full rebuild if no good commits found neither on PR nor on base branch', async () => {
      githubApi
        .getLastGoodPRRun(headBranch, 'pullrequest', Arg.any())
        .resolves(undefined)
      githubApi
        .getLastGoodBranchBuildRun(baseBranch, 'push', Arg.any())
        .resolves(undefined)

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        headBranch,
        baseBranch,
        prBranch,
        'pullrequest',
      )
      expect(actual).toBe('rebuild')
    })
  })
  describe('PR to release branch', () => {
    let mainGoodBeforeBadSha: string
    let fixGoodSha: string
    let hotfix2: string
    let hotfix3: string
    const mainBranch = 'main'
    const releaseBranch = 'release-13.2.0'
    const hotfixBranch = 'hotfix-123'
    const pr = 'pr-hotfix'
    let hotfix1: string
    let mergeSha1: string
    let mergeSha2: string
    beforeEach(async () => {
      await git.checkoutLocalBranch(mainBranch)
      mainGoodBeforeBadSha = await makeChange(git, 'a', 'A-good')
      await makeChange(git, 'a', 'C-bad')
      await git.checkoutBranch(releaseBranch, mainBranch)
      hotfix1 = await makeChange(git, 'a', 'C1-bad')

      await git.checkoutBranch(hotfixBranch, releaseBranch)
      await makeChange(git, 'b', 'D-bad')
      await makeChange(git, 'b', 'D2-good')
      await makeChange(git, 'c', 'D3-good')

      fixGoodSha = await makeChange(git, 'b', 'E-good')
      await git.checkout(releaseBranch)
      hotfix2 = await makeChange(git, 'd', 'D1-good')
      hotfix3 = await makeChange(git, ['a', 'b', 'c', 'd', 'e'], 'D2-good')

      await git.checkoutBranch('pr1', hotfix1)
      mergeSha1 = await git.merge(fixGoodSha)
      await git.checkoutBranch('pr3', hotfix1)
      mergeSha1 = await git.merge(fixGoodSha)
      await git.checkoutBranch('pr2', hotfix2)
      mergeSha2 = await git.merge(fixGoodSha)

      await git.checkoutBranch(prBranch, releaseBranch)
      await git.mergeFromTo(hotfixBranch, prBranch)
    })
    it('should use last good branch from main when no good runs on base or head branch', async () => {
      githubApi
        .getLastGoodPRRun(hotfixBranch, 'pullrequest', Arg.any())
        .resolves(undefined)
      githubApi
        .getLastGoodBranchBuildRun(
          releaseBranch,
          'push',
          Arg.is((commits) => commits.includes(mainGoodBeforeBadSha)),
        )
        .resolves({ head_commit: mainGoodBeforeBadSha, run_nr: 2 })

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        hotfixBranch,
        releaseBranch,
        prBranch,
        'pullrequest',
      )
      expect(actual).toStrictEqual({
        sha: mainGoodBeforeBadSha,
        run_number: 2,
        branch: releaseBranch,
        ref: mainGoodBeforeBadSha,
      })
    })

    it('should prefer the lighter run between a PR run a base branch run', async () => {
      githubApi
        .getLastGoodPRRun(
          hotfixBranch,
          'pullrequest',
          Arg.is(
            (commits) =>
              commits.includes(fixGoodSha) && commits.includes(hotfix1),
          ),
        )
        .resolves({ head_commit: fixGoodSha, base_commit: hotfix1, run_nr: 2 })
      githubApi
        .getLastGoodBranchBuildRun(
          releaseBranch,
          'push',
          Arg.is((commits) => commits.includes(hotfix3)),
        )
        .resolves({ head_commit: hotfix3, run_nr: 3 })

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        hotfixBranch,
        releaseBranch,
        prBranch,
        'pullrequest',
      )
      expect(actual).toStrictEqual({
        sha: hotfix3,
        run_number: 3,
        branch: releaseBranch,
        ref: hotfix3,
      })
    })
    it('prefer lighter branch run over heavier PR run', async () => {
      githubApi
        .getLastGoodPRRun(
          hotfixBranch,
          'pullrequest',
          Arg.is(
            (commits) =>
              commits.includes(fixGoodSha) && commits.includes(hotfix2),
          ),
        )
        .resolves({ head_commit: fixGoodSha, base_commit: hotfix2, run_nr: 2 })
      githubApi
        .getLastGoodBranchBuildRun(
          releaseBranch,
          'push',
          Arg.is((commits) => commits.includes(hotfix3)),
        )
        .resolves({ head_commit: hotfix3, run_nr: 3 })

      let actual = await findBestGoodRefPR(
        (services) => services.length,
        git,
        githubApi,
        hotfixBranch,
        releaseBranch,
        prBranch,
        'pullrequest',
      )
      expect(actual).toStrictEqual({
        sha: hotfix3,
        run_number: 3,
        branch: releaseBranch,
        ref: hotfix3,
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
        .getLastGoodBranchBuildRun(baseBranch, 'push', Arg.any())
        .resolves({ head_commit: goodBeforeBadSha, run_nr: 1 })
      githubApi
        .getLastGoodBranchBuildRun(
          headBranch,
          'push',
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
          'push',
        ),
      ).toStrictEqual({
        sha: hotfix1,
        run_number: 2,
        branch: headBranch,
        ref: hotfix1,
      })
    })
    it('should take base branch commits if no good on head branch', async () => {
      githubApi
        .getLastGoodBranchBuildRun(baseBranch, 'push', Arg.any())
        .resolves({ head_commit: goodBeforeBadSha, run_nr: 1 })
      githubApi
        .getLastGoodBranchBuildRun(headBranch, 'push', Arg.any())
        .resolves(undefined)

      expect(
        await findBestGoodRefBranch(
          (services) => services.length,
          git,
          githubApi,
          headBranch,
          baseBranch,
          'push',
        ),
      ).toStrictEqual({
        sha: goodBeforeBadSha,
        run_number: 1,
        branch: baseBranch,
        ref: goodBeforeBadSha,
      })
    })
    it('should trigger a full rebuild if no good commits found neither on head nor base branch', async () => {
      githubApi
        .getLastGoodBranchBuildRun(baseBranch, 'push', Arg.any())
        .resolves(undefined)

      expect(
        await findBestGoodRefBranch(
          (services) => services.length,
          git,
          githubApi,
          baseBranch,
          baseBranch,
          'push',
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
        .getLastGoodBranchBuildRun(baseBranch, 'push', Arg.any())
        .resolves({ head_commit: goodBeforeBadSha, run_nr: 1 })

      expect(
        await findBestGoodRefBranch(
          (services) => services.length,
          git,
          githubApi,
          headBranch,
          baseBranch,
          'push',
        ),
      ).toStrictEqual({
        sha: goodBeforeBadSha,
        run_number: 1,
        branch: baseBranch,
        ref: goodBeforeBadSha,
      })
    })
    it('should trigger a full rebuild if no good commits found neither on head nor base branch', async () => {
      githubApi
        .getLastGoodBranchBuildRun(baseBranch, 'push', Arg.any())
        .resolves(undefined)

      expect(
        await findBestGoodRefBranch(
          (services) => services.length,
          git,
          githubApi,
          baseBranch,
          baseBranch,
          'push',
        ),
      ).toBe('rebuild')
    })
  })
})

async function getChangedComponents(
  git: SimpleGit,
  currentSha: string,
  olderSha: string,
): Promise<string[]> {
  const diffNames = await git.raw('diff', '--name-only', currentSha, olderSha)
  return [
    // @ts-ignore
    ...new Set(
      diffNames
        .split('\n')
        .map((l) => l.trim().split('/')[0])
        .filter((s) => s.length > 0),
    ),
  ]
}

const mkdirAsync = promisify(mkdir)

async function makeChangeWithContent(
  git: SimpleGit,
  changeSet: { path: string; content: string }[],
  message: string,
): Promise<string> {
  for (const change of changeSet) {
    await writeFile(change.path, change.content)
    await git.add(change.path)
  }
  const commit = await git.commit(message)
  return commit.slice(0, 7)
}

async function makeChangeGlobal(
  component: Component | Component[],
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
