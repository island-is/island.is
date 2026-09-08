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
        'lyfjastofnun-forms-import',
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

/*
  Reads a positive-integer flag, returning undefined when the flag is absent so
  callers fall back to their own default.

  Rejects rather than passes through: NaN (which would silently poison whatever
  it flows into — `setMonth(NaN)` yields an Invalid Date and an unusable API
  query), zero (`--limit 0` is not nullish, so it survives `?? DEFAULT` and the
  job reports success having imported nothing), and negatives (`--months -6`
  puts the window in the future and matches no posts).

  A flag that is present but unusable is warned about, not swallowed: silently
  falling back means `--months 36x` runs a 12-month window while the operator
  believes they launched a three-year backfill.
*/
const parseNumericFlag = (flag: string): number | undefined => {
  const index = process.argv.indexOf(flag)
  if (index === -1) return undefined

  const raw = process.argv[index + 1]
  const value = Number(raw)

  if (!Number.isInteger(value) || value <= 0) {
    logger.warn(
      `Ignoring ${flag}: expected a positive integer, falling back to the default`,
      { value: raw },
    )
    return undefined
  }

  return value
}

export const parseCliFlags = () => {
  const publish = process.argv.includes('--publish')
  const limit = parseNumericFlag('--limit')
  const months = parseNumericFlag('--months')
  const slugArgIndex = process.argv.indexOf('--slug')
  const slug = slugArgIndex !== -1 ? process.argv[slugArgIndex + 1] : undefined
  return { publish, limit, months, slug }
}
