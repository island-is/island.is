import { LocalRunner } from './ci-io'
import { findBestGoodRefBranch, findBestGoodRefPR } from './change-detection'
import { Octokit } from '@octokit/action'
import { SimpleGit } from './simple-git'
import { WorkflowID } from './git-action-status'

const FULL_REBUILD_NEEDED = 'full_rebuild_needed'

const IS_PULL_REQUEST = process.env.GITHUB_EVENT_NAME === 'pull_request';

;(async () => {
  if (process.env.NX_AFFECTED_ALL === 'true') {
    console.log(FULL_REBUILD_NEEDED)
    return
  }
  const runner = new LocalRunner(new Octokit())
  let git = new SimpleGit(process.env.REPO_ROOT!, process.env.SHELL!)

  const diffWeight = (s: string[]) => s.length
  const rev = await (() => {
    if (IS_PULL_REQUEST) {
      return findBestGoodRefPR(
        diffWeight,
        git,
        runner,
        `'${process.env.HEAD_REF!}'`,
        `'${process.env.BASE_REF!}'`,
        `'${process.env.PR_REF!}'`,
        process.env.WORKFLOW_ID! as WorkflowID,
      )
    }
      return findBestGoodRefBranch(
        diffWeight,
        git,
        runner,
        `'${process.env.HEAD_REF!}'`,
        `'${process.env.BASE_REF!}'`,
        process.env.WORKFLOW_ID! as WorkflowID,
      )
  })();
  
  if (rev === 'rebuild') {
    console.log(FULL_REBUILD_NEEDED)
    return
  }
  rev.branch = rev.branch.replace(/'/g, '')
  rev.ref = rev.ref.replace(/'/g, '')
  console.log(JSON.stringify(rev))
})()
