import { LocalRunner } from './ci-io'
import { findBestGoodRefBranch, findBestGoodRefPR } from './change-detection'
import { Octokit } from '@octokit/action'
import { SimpleGit } from './simple-git'
import { WorkflowID } from './git-action-status'
;(async () => {
  const runner = new LocalRunner(new Octokit())
  let git = new SimpleGit(process.env.REPO_ROOT!, process.env.SHELL!)

  const diffWeight = (s: string[]) => s.length
  const rev =
    process.env.GITHUB_EVENT_NAME === 'pull_request'
      ? await findBestGoodRefPR(
          diffWeight,
          git,
          runner,
          process.env.HEAD_REF!,
          process.env.BASE_REF!,
          process.env.PR_REF!,
          process.env.WORKFLOW_ID! as WorkflowID,
        )
      : await findBestGoodRefBranch(
          diffWeight,
          git,
          runner,
          process.env.HEAD_REF!,
          process.env.BASE_REF!,
          process.env.WORKFLOW_ID! as WorkflowID,
        )

  if (rev === 'rebuild') {
    console.log(`Full rebuild needed`)
  } else {
    console.log(JSON.stringify(rev))
  }
})()
