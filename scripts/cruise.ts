import path from 'path'
import yargs from 'yargs/yargs'
import { exec } from 'child_process'
import chalk from 'chalk'
const repoUrl = 'https://github.com/island-is/island.is'

const runCommand = (cmd: string, log: string): Promise<string> => {
  console.log(chalk.cyan(log))
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error || stderr || !stdout) {
        reject(
          new Error(`Error getting project root directory: ${error || stderr}`),
        )
        return
      }

      resolve(stdout.trim())
    })
  })
}

yargs(process.argv.slice(2))
  .command(
    '$0',
    'Run dependency-cruiser',
    (yargs) => {
      return yargs.options({
        project: {
          type: 'string',
          demandOption: true,
          alias: 'p',
          description: 'NX project name',
        },
      })
    },
    async (argv) => {
      const workspacePath = await runCommand(
        'git rev-parse --show-toplevel',
        "Resolving workspace's root path ...",
      )

      const projectPath = await runCommand(
        `yarn nx show project ${argv.project} | jq -r '.root'`,
        `Resolving ${argv.project} path ...`,
      )
      const cmd = `yarn depcruise`
      const args = [
        `-c ${path.join(workspacePath, '.dependency-cruiser.js')}`,
        `--ts-config ${path.join(projectPath, 'tsconfig.json')}`,
        `--output-type dot`,
        projectPath,
        `|`,
        `dot -T svg`,
        `|`,
        `npx depcruise-wrap-stream-in-html`,
        `>`,
        `${workspacePath}/depgraph.html`,
      ].join(' ')
      console.log(args)
      try {
        const repoPrefix = runCommand(
          'git symbolic-ref --quiet --short HEAD',
          'Resolving current branch ...',
        )
        exec(`REPO_PREFIX=${repoUrl}/tree/${repoPrefix} ${cmd} ${args}`)
        console.log('Cruise operation completed successfully.')
      } catch (error) {
        console.error(
          'An error occurred while running dependency-cruiser:',
          error,
        )
      }
    },
  )
  .parse()
