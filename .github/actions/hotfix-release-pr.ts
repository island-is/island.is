import { execSync } from 'child_process'
import { Octokit } from '@octokit/action'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const [REPO_OWNER, REPO_NAME] = (process.env.GITHUB_REPOSITORY || '').split('/')

const getCommitMessage = (): string => {
  return execSync('git log -1 --pretty=%B').toString().trim()
}

const allChecksPassed = async (sha: string): Promise<boolean> => {
  const { data: status } = await octokit.rest.repos.getCombinedStatusForRef({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    ref: sha,
  })

  return status.state === 'success'
}

const getTargetBranch = async (): Promise<string | null> => {
  const { data: branches } = await octokit.rest.repos.listBranches({
    owner: REPO_OWNER,
    repo: REPO_NAME,
  })

  const preReleaseBranch = branches.find((branch) =>
    branch.name.startsWith('pre-release/'),
  )
  if (preReleaseBranch) return preReleaseBranch.name

  const releaseBranches = branches.filter((branch) =>
    branch.name.startsWith('release/'),
  )
  if (releaseBranches.length > 0)
    return releaseBranches[releaseBranches.length - 1].name

  return null
}

const createPR = async () => {
  const commitMessage = getCommitMessage()
  if (!commitMessage.includes('hotfix')) {
    console.log('Not a hotfix. Exiting.')
    return
  }

  const isAllChecksSuccessful = await allChecksPassed(process.env.GITHUB_SHA!)
  if (!isAllChecksSuccessful) {
    console.log('Not all checks passed. Exiting.')
    return
  }

  const targetBranch = await getTargetBranch()
  if (!targetBranch) {
    console.log('No target branch found. Exiting.')
    return
  }

  const branchName = `hotfix-${process.env.GITHUB_SHA}`

  execSync(`git checkout -b ${branchName}`)
  execSync(`git push origin ${branchName}`)

  const { data: pr } = await octokit.rest.pulls.create({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    head: branchName,
    base: targetBranch,
    title: `Hotfix PR for ${targetBranch}`,
    body: 'This is an automated hotfix PR.',
  })

  await octokit.rest.issues.addLabels({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    issue_number: pr.number,
    labels: ['hotfix'],
  })
}

createPR()
