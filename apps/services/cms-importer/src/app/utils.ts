import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

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
      ] as const,
      description: 'Indicate what import application should run',
    })
    .parseSync().job
