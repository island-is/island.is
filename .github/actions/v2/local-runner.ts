import { LocalRunner } from './ci-io'
import { findBestGoodRefPR } from './change-detection'
import simpleGit from 'simple-git'
;(async () => {
  const runner = new LocalRunner()
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
    const distance = await runner.calculateDistance(git, 'HEAD', rev)
    console.log(rev)
  }
})()
