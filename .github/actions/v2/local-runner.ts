import { LocalRunner } from './ci-io'
import { findBestGoodRefPR } from './change-detection'
import { Octokit } from '@octokit/rest'
import { SimpleGit } from './simple-git'
;(async () => {
  const octokit = new Octokit(
    // For local development
    {
      auth: process.env.GITHUB_TOKEN,
    },
  )

  const runner = new LocalRunner(octokit)
  let git = new SimpleGit(`${__dirname}/../../..`, '/bin/bash')
  const rev = await findBestGoodRefPR(
    (s) => s.length,
    git,
    runner,
    `infra/new-ci-change-detector`,
    'main',
    `origin/pr/6665`,
  )
  if (rev === 'rebuild') {
    console.log(`Full rebuild needed`)
  } else {
    console.log(JSON.stringify(rev))
  }
})()
