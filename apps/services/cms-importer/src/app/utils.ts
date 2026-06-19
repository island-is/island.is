import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { IMAGE_CONTENT_TYPE_MAP } from './constants'

const referenceIdPattern = /^([0-9]+)-([0-9]+)$/

export const parseReferenceId = (referenceId: string): string | null => {
  const regExResult = referenceIdPattern.exec(referenceId)
  if (!regExResult) {
    return null
  }
  return regExResult[2]
}

export const guessImageContentType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  return IMAGE_CONTENT_TYPE_MAP[ext ?? ''] ?? 'image/jpeg'
}

export const cleanImageTitle = (fileName: string): string => {
  const cleaned = fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
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
        'lyfjastofnun-news-import',
      ] as const,
      description: 'Indicate what import application should run',
    })
    .parseSync().job
