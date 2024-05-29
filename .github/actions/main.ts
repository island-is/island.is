import { LocalRunner } from './ci-io'
import { findBestGoodRefBranch, findBestGoodRefPR } from './change-detection'
import { Octokit } from '@octokit/action'
import { SimpleGit } from './simple-git'
import { WorkflowID } from './git-action-status'
import Debug from 'debug'
const log = Debug('main.js')

  log(`Starting with head branch ${headBranch} and base branch ${baseBranch}`)
;(async () => {
  const runner = new LocalRunner(new Octokit())
  let git = new SimpleGit(process.env.REPO_ROOT!, process.env.SHELL!)
  const diffWeight = (s: string[]) => s.length
  const rev = process.env.GITHUB_EVENT_NAME === 'pull_request'
    ? await findBestGoodRefPR(
        diffWeight,
        git,
        runner,
        `'${process.env.HEAD_REF!}'`,
        `'${process.env.BASE_REF!}'`,
        `'${process.env.PR_REF!}'`,
        process.env.WORKFLOW_ID! as WorkflowID,
      )
    : await findBestGoodRefBranch(
        diffWeight,
        git,
        runner,
        `'${process.env.HEAD_REF!}'`,
        `'${process.env.BASE_REF!}'`,
        process.env.WORKFLOW_ID! as WorkflowID,
      )

  if (rev === 'rebuild') {
    log(`Returning with rebuild`);
    console.log(`Full rebuild needed`)
    log(`Done`);
  } else {
    log(`Returning with app`);
    rev.branch = rev.branch.replace(/'/g, '')
    rev.ref = rev.ref.replace(/'/g, '')
    console.log(JSON.stringify(rev))
    log(`Done`);
  }
})()
