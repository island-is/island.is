import { IMAGE_CONTENT_TYPE_MAP } from '../../../../constants'

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
