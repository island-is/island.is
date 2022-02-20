import { LocalRunner } from './ci-io'
import { findBestGoodRefPR } from './change-detection'
import simpleGit from 'simple-git'
import { Octokit } from '@octokit/action'
;(async () => {
  const runner = new LocalRunner(new Octokit())
  let git = simpleGit({ baseDir: `${__dirname}/../../..` })
  const rev = await findBestGoodRefPR(
    (s) => s.length,
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
