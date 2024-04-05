import { runCommandSync } from '../common'
import { logger } from '../logging'

/**
 * Gets the last good SHA using GitHub's GraphQL API. Currently assumes the current commit is good.
 * @returns The good SHA.
 */
const getLastGoodSha = () => {
  const goodSha = runCommandSync({ command: 'git rev-parse HEAD' }).stdout
  logger.warn(`Assuming current commit is good (${goodSha})`)
  return goodSha
}

/**
 * Gets the last release version.
 * @param localVersion Whether to use local versioning.
 * @returns The last release version.
 */
const getLastRelease = (localVersion: boolean) => {
  const branches = runCommandSync({
    command: `git branch ${localVersion ? '' : '-r'}`,
  })
  const releaseRegex = /release\/(\d+\.\d+\.\d+)/g
  const matches = [...branches.stdout.join('\n').matchAll(releaseRegex)].map(
    (m) => m[1],
  )
  if (!matches.length) return '0.0.0'
  return matches.sort().reverse()[0]
}

/**
 * Bumps the release number based on the current release and the maximum minor version.
 * @param args.currentRelease The current release version.
 * @param args.maxMinor The maximum minor version.
 * @param args.releaseVersion The release version to set, if any.
 * @returns The bumped release version.
 */
const bumpReleaseNumber = ({
  currentRelease,
  maxMinor,
  releaseVersion,
}: {
  currentRelease: string
  maxMinor: number
  releaseVersion?: string
}) => {
  if (releaseVersion) return releaseVersion

  let [major, minor, patch] = currentRelease.split('.').map(Number)
  minor = minor >= maxMinor ? 0 : minor + 1
  major += minor === 0 ? 1 : 0

  return `${major}.${minor}.${patch}`
}

/**
 * Creates a pre-release branch with the next version number.
 * @param args.pushReleaseBranch Whether to push the release branch to remote.
 * @param args.ignoreExistingRelease Whether to ignore if the release already exists.
 * @param args.localVersion Whether to use local versioning.
 * @param args.maxMinor The maximum minor version.
 * @param args.releaseVersion The release version to set, if any.
 */
export const createPreReleaseBranch = ({
  pushReleaseBranch,
  ignoreExistingRelease,
  localVersion,
  maxMinor,
  releaseVersion,
  dryRun = false,
}: {
  pushReleaseBranch: boolean
  ignoreExistingRelease: boolean
  localVersion: boolean
  maxMinor: number
  releaseVersion?: string
  dryRun?: boolean
}) => {
  const currentRelease = getLastRelease(localVersion)
  const bumpedRelease = bumpReleaseNumber({
    currentRelease,
    maxMinor,
    releaseVersion,
  })
  const newBranch = `pre-release/${bumpedRelease}`
  const lastGoodSha = getLastGoodSha()

  logger.info(`Creating branch ${newBranch} locally`)
  runCommandSync({
    command: `git branch ${newBranch} ${lastGoodSha}`,
    dryRun,
  }) || logger.error(`Error creating branch ${newBranch} locally`)

  if (pushReleaseBranch) {
    logger.info(`Pushing branch ${newBranch} to remote`)
    runCommandSync({
      command: `git push --set-upstream origin ${newBranch}`,
      dryRun,
    }) || logger.error(`Error pushing branch ${newBranch} to remote`)
  }
}
