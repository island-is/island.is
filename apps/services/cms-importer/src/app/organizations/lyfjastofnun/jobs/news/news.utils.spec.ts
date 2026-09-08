import { SEED_IMAGE_ASSET_IDS } from './constants'
import { cleanImageTitle, guessImageContentType, pickSeedImage } from './utils'

describe('pickSeedImage', () => {
  it('always returns an id from the seed set', () => {
    for (const slug of ['prac-juni-2026', 'a', '', 'ný-frétt-um-lyf-2024']) {
      expect(SEED_IMAGE_ASSET_IDS).toContain(pickSeedImage(slug))
    }
  })

  it('is stable for the same slug', () => {
    // The whole point: re-importing must not reshuffle imagery on articles
    // that already exist.
    const slug = 'nytt-fra-cvmp-mai-2026'
    expect(pickSeedImage(slug)).toBe(pickSeedImage(slug))
  })

  it('does not give every slug the same image', () => {
    const slugs = Array.from({ length: 200 }, (_, i) => `frett-nr-${i}`)
    const used = new Set(slugs.map(pickSeedImage))
    expect(used.size).toBeGreaterThan(1)
  })

  it('spreads reasonably evenly across the set', () => {
    // 300+ backfilled articles over 21 images should not pile onto a handful.
    const slugs = Array.from(
      { length: 420 },
      (_, i) => `lyfjastofnun-frett-${i}`,
    )
    const used = new Set(slugs.map(pickSeedImage))
    expect(used.size).toBe(SEED_IMAGE_ASSET_IDS.length)
  })

  it('has no duplicate ids in the seed set', () => {
    expect(new Set(SEED_IMAGE_ASSET_IDS).size).toBe(SEED_IMAGE_ASSET_IDS.length)
  })
})

describe('guessImageContentType', () => {
  it('maps known extensions', () => {
    expect(guessImageContentType('a.png')).toBe('image/png')
  })

  it('falls back to jpeg for an unknown extension', () => {
    expect(guessImageContentType('a.weird')).toBe('image/jpeg')
  })
})

describe('cleanImageTitle', () => {
  it('turns a file name into a title', () => {
    expect(cleanImageTitle('kona_med_lyfjaglas.jpg')).toBe('Kona med lyfjaglas')
  })

  it('keeps non-ASCII letters', () => {
    expect(cleanImageTitle('tóm-lyfjaspjöld.jpg')).toBe('Tóm lyfjaspjöld')
  })
})
