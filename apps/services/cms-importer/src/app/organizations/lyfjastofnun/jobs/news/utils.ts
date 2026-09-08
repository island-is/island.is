import { IMAGE_CONTENT_TYPE_MAP } from '../../../../constants'
import { SEED_IMAGE_ASSET_IDS } from './constants'

export const guessImageContentType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  return IMAGE_CONTENT_TYPE_MAP[ext ?? ''] ?? 'image/jpeg'
}

/*
  Picks a fallback image for a post, derived from its slug rather than at
  random. A given post therefore always resolves to the same image, which makes
  a run reproducible: re-importing, or reviewing a few hundred drafts, will not
  reshuffle the imagery on content that already exists. Spread across the set
  is the point, not unpredictability.

  FNV-1a, chosen because it needs no dependency and distributes short ASCII
  slugs evenly. Not security-relevant.
*/
export const pickSeedImage = (slug: string): string => {
  let hash = 0x811c9dc5
  for (let i = 0; i < slug.length; i++) {
    hash ^= slug.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  const index = Math.abs(hash) % SEED_IMAGE_ASSET_IDS.length
  return SEED_IMAGE_ASSET_IDS[index]
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
