import { LocalRunner } from './ci-io'
import { findBestGoodRefBranch, findBestGoodRefPR } from './change-detection'
import simpleGit, { SimpleGitProgressEvent } from 'simple-git'
import { Octokit } from '@octokit/action'
import { GitExecutorResult } from 'simple-git/src/lib/types'
;(async () => {
  const runner = new LocalRunner(new Octokit())
  const progress = ({ method, stage, progress }: SimpleGitProgressEvent) => {
    console.log(`git.${method} ${stage} stage ${progress}% complete`)
  }
  let git = simpleGit({
    baseDir: `${__dirname}/../../..`,
    maxConcurrentProcesses: 1,
    progress: progress,
    errors(
      error: Buffer | Error | undefined,
      result: Omit<GitExecutorResult, 'rejection'>,
    ): Buffer | Error | undefined {
      if (error) return error

      // customise the `errorCode` values to treat as success
      if (result.exitCode === 0) {
        return
      }

      // the default error messages include both stdOut and stdErr, but that
      // can be changed here, or completely replaced with some other content
      console.log(`Error: ${result.stdErr.toString()}`)
      console.log(`Info: ${result.stdOut.toString()}`)
      return Buffer.concat([...result.stdOut, ...result.stdErr])
    },
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
