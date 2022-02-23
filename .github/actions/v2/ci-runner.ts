import { LocalRunner } from './ci-io'
import { findBestGoodRefBranch, findBestGoodRefPR } from './change-detection'
import simpleGit from 'simple-git'
import { Octokit } from '@octokit/action'
;(async () => {
  const runner = new LocalRunner(new Octokit())
  let git = simpleGit({
    baseDir: `${__dirname}/../../..`,
    maxConcurrentProcesses: 1,
  })

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
