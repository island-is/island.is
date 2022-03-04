import { LocalRunner } from './ci-io'
import { findBestGoodRefPR } from './change-detection'
import { Octokit } from '@octokit/rest'
import { SimpleGit } from './simple-git'
import { join } from 'path'
;(async () => {
  const octokit = new Octokit(
    // For local development
    {
      auth: process.env.GITHUB_TOKEN,
    },
  )

  const runner = new LocalRunner(octokit)
  let git = new SimpleGit(join(__dirname, '..', '..'), '/bin/bash')
  const rev = await findBestGoodRefPR(
    (s) => s.length,
    git,
    runner,
    `core/sort-imports`,
    'main',
    `origin/pr/6637`,
    'pullrequest',
  )
  if (rev === 'rebuild') {
    console.log(`Full rebuild needed`)
  } else {
    console.log(JSON.stringify(rev))
  }
})()
