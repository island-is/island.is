export const LYFJASTOFNUN_ORG_ID = '75k5yLmcFqBQIpeODAN4t7'
export const LYFJASTOFNUN_OWNER_TAG = 'ownerLyfjastofnun'

export const LEIDBEININGAR_URL =
  'https://www.lyfjastofnun.is/utgefid-efni/leidbeiningar/'

// English mirror is a separate domain (Icelandic Medicines Agency), not a
// /en/ path on lyfjastofnun.is. It covers far fewer items than the Icelandic
// page and uses different file names for the same documents, so it can only
// be cross-matched reliably via shared external links, not by file name.
export const LEIDBEININGAR_URL_EN =
  'https://www.ima.is/published_material/guidelines/'

export const LISTAR_URL = 'https://www.lyfjastofnun.is/utgefid-efni/listar/'

// English mirror is a separate domain (Icelandic Medicines Agency), not a
// /en/ path on lyfjastofnun.is — it only covers a subset of the Icelandic
// items.
export const LISTAR_URL_EN = 'https://www.ima.is/published_material/lists/'

export const EYDUBLOD_URL = 'https://www.lyfjastofnun.is/utgefid-efni/eydublod/'

// As with the guidelines and lists pages, the English mirror lives on the
// separate ima.is domain and covers fewer items (38 vs 50). It also republishes
// most documents under its own file names, so `matchKeyFor` only cross-matches
// the handful that happen to share a file name or external link — the rest of
// the English titles are transcribed by hand (see title-translations.ts).
export const EYDUBLOD_URL_EN = 'https://www.ima.is/published_material/forms/'

export const WP_BASE_URL = 'https://www.lyfjastofnun.is/wp-json/wp/v2'
