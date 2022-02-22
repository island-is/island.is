import { LocalRunner } from './ci-io'
import { findBestGoodRefBranch, findBestGoodRefPR } from './change-detection'
import simpleGit from 'simple-git'
import { Octokit } from '@octokit/action'
;(async () => {
  const runner = new LocalRunner(new Octokit())
  let git = simpleGit({
    baseDir: `${__dirname}/../../..`,
    maxConcurrentProcesses: 1,
    binary: process.env.GIT_BINARY,
  })
  git.env(process.env)
  const diffWeight = (s) => s.length
  const rev =
    process.env.GITHUB_EVENT_NAME === 'pull_request'
      ? await findBestGoodRefPR(
          diffWeight,
          git,
          runner,
          process.env.HEAD,
          process.env.BASE,
          process.env.PR,
        )
      : await findBestGoodRefBranch(
          diffWeight,
          git,
          runner,
          process.env.HEAD,
          process.env.BASE,
        )

  if (rev === 'rebuild') {
    console.log(`Full rebuild needed`)
  } else {
    console.log(JSON.stringify(rev))
  }
})()
