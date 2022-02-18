import { LocalRunner } from './ci-io'
import { findBestGoodRefBranch } from './change-detection'
import simpleGit from 'simple-git'
;(async () => {
  const runner = new LocalRunner()
  const rev = await findBestGoodRefBranch(
    (s) => s.length,
    simpleGit({ baseDir: `${__dirname}/../../..` }),
    runner,
    `infra/new-ci-change-detector`,
    'main',
  )
  console.log(rev)
})()
