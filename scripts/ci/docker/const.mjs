export const MAIN_BRANCHES = ['main']

export const RELEASE_BRANCH_REGEX = /^release(?:\/(?:\d+\.\d+\.\d+|\d{4}\.\d{1,2}\.\d{1,2}\.\d+))?$/

export const isMainBranch = (branch) => MAIN_BRANCHES.includes(branch)

export const isReleaseBranch = (branch) => RELEASE_BRANCH_REGEX.test(branch)

export const getReleaseVersion = (branch) => branch.replace('release/', '')
