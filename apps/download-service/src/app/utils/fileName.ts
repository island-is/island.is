import slugify from '@sindresorhus/slugify'
import { basename, extname } from 'path'

const customReplacements: Array<[string, string]> = [
  ['Þ', 'th'],
  ['ö', 'o'],
]

export const slugifyFileName = (fileName: string, fallback: string) =>
  slugify(fileName || fallback, { customReplacements })

export const toSafeFileName = (
  fileName: string | undefined,
  fallback: string,
) => {
  const ext = fileName ? extname(fileName) : ''
  const base = fileName ? basename(fileName, ext) : ''
  return `${slugifyFileName(base, fallback)}${ext}`
}
