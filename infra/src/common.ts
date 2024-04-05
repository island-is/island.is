import { spawn, spawnSync, SpawnSyncReturns } from 'child_process'
import { rootDir } from './dsl/consts'
import { logger } from './logging'

export async function runCommand({
  command,
  cwd = rootDir,
  project = '',
  projectNameSize = 25,
  dryRun = false,
}: {
  command: string | string[]
  cwd?: string
  project?: string
  projectNameSize?: number
  dryRun?: boolean
}) {
  if (!Array.isArray(command)) {
    command = [command]
  }
  const projectLabel = `${project
    .padEnd(projectNameSize, ' ')
    .slice(0, projectNameSize)} `
  const logMessage = (message: string) => `${projectLabel} - ${message}`
  if (dryRun) {
    logger.info(logMessage(`[DRY RUN] ${command.join(' ')}`))
    return spawn('true')
  }
  const proc = spawn(command.join(' '), [], {
    cwd,
    shell: true,
    stdio: 'pipe',
  })
  proc.stdout?.on('data', (data) => {
    data
      .toString()
      .split('\n')
      .forEach((line: string) => {
        if (line.trim().length > 0) {
          logger.info(logMessage(line))
        }
      })
  })
  proc.stderr?.on('data', (data) => {
    data
      .toString()
      .split('\n')
      .forEach((line: string) => {
        if (line.trim().length > 0) {
          logger.error(logMessage(line))
        }
      })
  })
  return proc
}

const bufferToLines = (data: Buffer) => data.toString().split('\n')
const processOutputFormatter = (proc: SpawnSyncReturns<Buffer>) => ({
  ...proc,
  stdout: bufferToLines(proc.stdout),
  stderr: bufferToLines(proc.stderr),
})
export const runCommandSync = (args: Parameters<typeof runCommand>[0]) => {
  logger.debug(`Running: ${args.command}`, { ...args, command: undefined })
  const command = Array.isArray(args.command)
    ? args.command.join(' ')
    : args.command
  if (args.dryRun) {
    logger.info(`[DRY RUN] ${command}`)
    return processOutputFormatter(spawnSync('true'))
  }
  const proc = spawnSync(command, {
    cwd: args.cwd,
    shell: true,
    stdio: 'pipe',
  })
  return processOutputFormatter(proc)
}

export { logger } from './logging'
