// The National Registry and Domain.displayName often use different forms of
// the same municipality name. The National Registry uses the geographic name
// (e.g. "Reykjavík") while domains are usually registered under the
// municipality's legal name (e.g. "Reykjavíkurborg"), with or without the
// "Sveitarfélagið" prefix (e.g. "Sveitarfélagið Múlaþing" vs "Múlaþing").
// Legal names whose geographic form differs by more than the prefix are
// mapped here, keyed and valued in normalized form.
const LEGAL_TO_GEOGRAPHIC_NAME: Record<string, string> = {
  reykjavíkurborg: 'reykjavík',
  kópavogsbær: 'kópavogur',
  seltjarnarnesbær: 'seltjarnarnes',
  hafnarfjarðarkaupstaður: 'hafnarfjörður',
  grindavíkurbær: 'grindavík',
  akraneskaupstaður: 'akranes',
  grundarfjarðarbær: 'grundarfjörður',
  bolungarvíkurkaupstaður: 'bolungarvík',
  ísafjarðarbær: 'ísafjörður',
  akureyrarbær: 'akureyri',
  vestmannaeyjabær: 'vestmannaeyjar',
  hveragerðisbær: 'hveragerði',
}

const MUNICIPALITY_PREFIX = 'sveitarfélagið '

/**
 * Reduces a municipality name to a canonical key so names from different
 * sources can be compared, e.g. the National Registry's "Reykjavík" and a
 * domain's "Reykjavíkurborg" both yield "reykjavík". Apply to both sides
 * of a comparison.
 */
export const municipalityNameKey = (name: string): string => {
  let key = name.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim()

  if (key.startsWith(MUNICIPALITY_PREFIX)) {
    key = key.slice(MUNICIPALITY_PREFIX.length)
  }

  return LEGAL_TO_GEOGRAPHIC_NAME[key] ?? key
}
