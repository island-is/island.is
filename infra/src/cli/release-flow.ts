import { execSync } from 'child_process'

/**
 * Executes a shell command and returns the output as a string.
 * @param command The shell command to execute.
 * @returns The output of the shell command.
 */
const execCommand = (command: string) => {
  try {
    return execSync(command, { stdio: 'pipe' }).toString().trim()
  } catch (error) {
    console.error(`Error executing command: ${command}`)
    throw error
  }
}

/**
 * Gets the last good SHA using GitHub's GraphQL API. Currently assumes the current commit is good.
 * @returns The good SHA.
 */
const getLastGoodSha = () => {
  const goodSha = execCommand('git rev-parse HEAD')
  console.error(`Assuming current commit is good (${goodSha})`)
  return goodSha
}

/**
 * Gets the last release version.
 * @param localVersion Whether to use local versioning.
 * @returns The last release version.
 */
const getLastRelease = (localVersion: boolean) => {
  const branches = execCommand(`git branch ${localVersion ? '' : '-r'}`)
  const releaseRegex = /release\/(\d+\.\d+\.\d+)/g
  const matches = [...branches.matchAll(releaseRegex)].map((m) => m[1])
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
}: {
  pushReleaseBranch: boolean
  ignoreExistingRelease: boolean
  localVersion: boolean
  maxMinor: number
  releaseVersion?: string
}) => {
  const currentRelease = getLastRelease(localVersion)
  const bumpedRelease = bumpReleaseNumber({
    currentRelease,
    maxMinor,
    releaseVersion,
  })
  const newBranch = `pre-release/${bumpedRelease}`
  const lastGoodSha = getLastGoodSha()

  try {
    execCommand(`git checkout -b ${newBranch} ${lastGoodSha}`)
    console.log(`Successfully created branch ${newBranch} locally`)

    if (pushReleaseBranch) {
      execCommand(`git push --set-upstream origin ${newBranch}`)
      console.log(`Successfully pushed branch ${newBranch} to remote`)
    }
  } catch (error) {
    if (!ignoreExistingRelease) {
      console.error(`Error creating pre-release branch: ${newBranch}`)
      throw error
    }
  }
}
