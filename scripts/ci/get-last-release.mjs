const releases = process.argv
  .slice(2)
  .flatMap(arg => arg.split(/\s+/))
  .map((release) => release.replace('origin/release/', ''))
  .filter((release) => /^\d+\.\d+\.\d+$/.test(release))
  .sort((a, b) => {
    const [aMajor, aMinor, aPatch] = a.split('.').map(Number)
    const [bMajor, bMinor, bPatch] = b.split('.').map(Number)
    if (aMajor !== bMajor) {
      return bMajor - aMajor
    } else if (aMinor !== bMinor) {
      return bMinor - aMinor
    } else {
      return bPatch - aPatch
    }
  })
console.log(releases[0])
