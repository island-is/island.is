import { Container } from '@dagger.io/dagger'
import {withCacheBust, withoutCacheBust} from "./cache-bust";

interface GitProps {
  sha?: string | undefined
  branch?: string | undefined
  targetBranch?: string

  container: Container
  headSha?: string
  baseSha?: string
}

export async function getBaseAndHeadShaGit(props: GitProps) {
  const { sha, branch, targetBranch, headSha, baseSha } = props
  if (headSha && baseSha) {
    return {
      headSha,
      baseSha,
    }
  }
  if (!sha && !branch) {
    throw new Error('Either sha or branch must be provided')
  }

  // We only need to calculate this if this hasn't been done before!
  let container =  await withCacheBust(props.container)
    .withExec(['git', 'fetch', 'origin', props.targetBranch, '--depth=10'])
    .withEnvVariable('_GIT_CURRENT_BRANCH', props.branch ?? props.sha)
    .withEnvVariable('_GIT_CURRENT_TARGET_BRANCH', props.targetBranch)
    .sync()


  const currentBranch = await (async () => {
    if (branch) {
      return branch
    }

    // If we know the branch name alredy, no need to cache bust. 
    const gitContainer = withoutCacheBust(container);

    const value = (
      await gitContainer
        .withEnvVariable('REDO', 'trueeee')
        .withExec([
          'git',
          'branch',
          '-r',
          '--contains',
          sha,
          '--format="%(refname:short)"',
        ])
        .stdout()
    )
      .split('\n')
      .filter((e) => {
        console.log(`Branch string: ${e}`)
        const branch = e.replace(/origin\//, '').split('/')
        if (branch.length > 1 || !branch[0]) {
          return false
        }
        return true
      })
      .map((e) => e.replace(/origin\//, ''))
    if (!value[0]) {
      throw new Error('No branch found for sha')
    }
    return value[0]
  })()

  const currentSha = await (async () => {
    if (sha) {
      return sha
    }
    return (
      await container.withExec(['git', 'rev-parse', `${origin}/currentBranch`]).stdout()
    ).trim()
  })()

  const targetSha = await (async () => {
     const latestShaOnTarget = await container.withExec(['git', 'rev-parse', `origin/${targetBranch}`]).stdout();
     if (targetBranch == currentBranch) {
       if (currentSha === latestShaOnTarget) {
        return (
            await container.withExec(['git', 'rev-parse', `origin/${targetBranch}^`]).stdout()
        ).trim();
       }
       // WEIRD?
       return latestShaOnTarget.trim();
     }
     return latestShaOnTarget.trim();
  })();

  return {
    headSha: currentSha,
    baseSha: targetSha,
  }
}
