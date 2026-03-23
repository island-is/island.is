// NOTE: hack until we move to stable release branch
const generateReleaseBranches = (majorVersions, minorVersionsPerMajor) => {
  const branches = ['release']

  for (const majorVersion of majorVersions) {
    for (
      let minorVersion = 1;
      minorVersion <= minorVersionsPerMajor;
      minorVersion++
    ) {
      branches.push(`release/${majorVersion}.${minorVersion}.0`)
      branches.push(`pre-release/${majorVersion}.${minorVersion}.0`)
    }
  }

  return branches
}

const majorVersions = Array.from({ length: 1000 }, (_, i) => 41 + i)
const minorVersionsPerMajor = 3

export const RELEASE_BRANCHES = generateReleaseBranches(
  majorVersions,
  minorVersionsPerMajor,
)
export const MAIN_BRANCHES = ['main']
