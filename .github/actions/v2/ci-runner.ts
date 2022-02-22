import { LocalRunner } from './ci-io'
import { findBestGoodRefBranch, findBestGoodRefPR } from './change-detection'
import simpleGit from 'simple-git'
import { Octokit } from '@octokit/action'
;(async () => {
  const runner = new LocalRunner(new Octokit())
  let git = simpleGit({ baseDir: `${__dirname}/../../..` })
  const diffWeight = (s) => s.length
  const rev = await (process.env.GITHUB_EVENT_NAME === 'pull_request'
    ? findBestGoodRefPR
    : findBestGoodRefBranch)(
    diffWeight,
    git,
    runner,
    `infra/new-ci-change-detector`,
    'main',
  )
  if (rev === 'rebuild') {
    console.log(`Full rebuild needed`)
  } else {
    console.log(JSON.stringify(rev))
  }
})()
