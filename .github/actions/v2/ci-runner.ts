import { LocalRunner } from './ci-io'
import { findBestGoodRefBranch, findBestGoodRefPR } from './change-detection'
// import simpleGit, { SimpleGitProgressEvent } from 'simple-git'
import { Octokit } from '@octokit/action'
import { GitExecutorResult } from 'simple-git/src/lib/types'
import { SimpleGit } from './simple-git'

;(async () => {
  const runner = new LocalRunner(new Octokit())
  let git = new SimpleGit(`${__dirname}/../../..`)

  const diffWeight = (s) => s.length
  const rev =
    process.env.GITHUB_EVENT_NAME === 'pull_request'
      ? await findBestGoodRefPR(
          diffWeight,
          git,
          runner,
          process.env.HEAD_REF,
          process.env.BASE_REF,
          process.env.PR_REF,
        )
      : await findBestGoodRefBranch(
          diffWeight,
          git,
          runner,
          process.env.HEAD_REF,
          process.env.BASE_REF,
        )

  if (rev === 'rebuild') {
    console.log(`Full rebuild needed`)
  } else {
    console.log(JSON.stringify(rev))
  }
})()
