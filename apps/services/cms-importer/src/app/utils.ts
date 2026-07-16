import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { INestApplicationContext, Type } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { logger } from '@island.is/logging'

const referenceIdPattern = /^([0-9]+)-([0-9]+)$/

export const parseReferenceId = (referenceId: string): string | null => {
  const regExResult = referenceIdPattern.exec(referenceId)
  if (!regExResult) {
    return null
  }
  return regExResult[2]
}

export const processJob = () =>
  yargs(hideBin(process.argv))
    .option('job', {
      string: true,
      choices: [
        'energy-fund-import',
        'grant-import',
        'fsre-buildings-import',
        'web-sitemap',
        'cms-cleanup',
        'lyfjastofnun-instructions-import',
        'lyfjastofnun-lists-import',
        'lyfjastofnun-news-import',
      ] as const,
      description: 'Indicate what import application should run',
    })
    .parseSync().job

// Shared bootstrap for every `*-worker.ts` entry point: creates the Nest
// application context, runs the import, and handles logging/exit codes so
// each worker only needs to say which module/service to run.
export const runWorker = async (
  label: string,
  moduleClass: Type<unknown>,
  execute: (app: INestApplicationContext) => Promise<unknown>,
) => {
  try {
    logger.info(`${label} worker job initiating...`)
    const app = await NestFactory.createApplicationContext(moduleClass)
    app.enableShutdownHooks()
    await execute(app)
    await app.close()
    logger.info(`${label} worker finished successfully.`)
    process.exit(0)
  } catch (error) {
    logger.error(`${label} worker encountered an error:`, error)
    process.exit(1)
  }
}

export const parseCliFlags = () => {
  const publish = process.argv.includes('--publish')
  const limitArgIndex = process.argv.indexOf('--limit')
  const limit =
    limitArgIndex !== -1 ? Number(process.argv[limitArgIndex + 1]) : undefined
  const slugArgIndex = process.argv.indexOf('--slug')
  const slug = slugArgIndex !== -1 ? process.argv[slugArgIndex + 1] : undefined
  return { publish, limit, slug }
}
