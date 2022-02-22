import { LocalRunner } from './ci-io'
import { findBestGoodRefPR } from './change-detection'
import simpleGit from 'simple-git'
import { Octokit } from '@octokit/rest'
;(async () => {
  const octokit = new Octokit(
    // For local development
    {
      auth: process.env.GITHUB_TOKEN,
    },
  )

  const runner = new LocalRunner(octokit)
  let git = simpleGit({ baseDir: `${__dirname}/../../..` })
  const rev = await findBestGoodRefPR(
    (s) => s.length,
    git,
    runner,
    `infra/new-ci-change-detector`,
    'main',
    `infra/new-ci-change-detector`,
  )
  if (rev === 'rebuild') {
    console.log(`Full rebuild needed`)
  } else {
    console.log(JSON.stringify(rev))
  }
})()
