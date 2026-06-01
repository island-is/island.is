export const MAIN_BRANCHES = ['main']

const SEMVER_RELEASE_BRANCH_REGEX = /^release\/\d+\.\d+\.\d+$/
const CALVER_RELEASE_BRANCH_REGEX = /^release\/\d{4}\.\d{1,2}\.\d{1,2}\.\d+$/
const SEMVER_PRE_RELEASE_BRANCH_REGEX = /^pre-release\/\d+\.\d+\.\d+$/
const CALVER_PRE_RELEASE_BRANCH_REGEX =
  /^pre-release\/\d{4}\.\d{1,2}\.\d{1,2}\.\d+$/

export const isMainBranch = (branch) => MAIN_BRANCHES.includes(branch)

export const isReleaseBranch = (branch) =>
  SEMVER_RELEASE_BRANCH_REGEX.test(branch) ||
  CALVER_RELEASE_BRANCH_REGEX.test(branch)

export const isPreReleaseBranch = (branch) =>
  SEMVER_PRE_RELEASE_BRANCH_REGEX.test(branch) ||
  CALVER_PRE_RELEASE_BRANCH_REGEX.test(branch)

export const isReleaseLikeBranch = (branch) =>
  branch?.startsWith('release/') || branch?.startsWith('pre-release/')
