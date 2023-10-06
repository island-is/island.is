import path from 'path'
import yargs from 'yargs/yargs'
import { exec } from './utils'

const repoUrl = 'https://github.com/island-is/island.is'

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
          description: 'Relative path to an NX project',
        },
      })
    },
    async (argv) => {
      const cwd = process.cwd()
      const projectPath = path.join(cwd, argv.project)
      const cmd = `yarn depcruise`
      const args = [
        `-c ${path.join(cwd, '.dependency-cruiser.js')}`,
        `--ts-config ${path.join(projectPath, 'tsconfig.json')}`,
        `--output-type dot`,
        projectPath,
        `|`,
        `dot -T svg`,
        `|`,
        `npx depcruise-wrap-stream-in-html`,
        `>`,
        `${cwd}/depgraph.html`,
      ].join(' ')
      try {
        const { stdout } = await exec(`git symbolic-ref --quiet --short HEAD`)
        console.log(stdout)
        await exec(
          `REPO_PREFIX=${repoUrl}/tree/${stdout.trim()} ${cmd} ${args}`,
        )
        // await exec(`${cmd} ${args}`)
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
