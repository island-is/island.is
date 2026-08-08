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

export const WP_BASE_URL = 'https://www.lyfjastofnun.is/wp-json/wp/v2'
export const IMPORT_MONTHS_BACK = 12
