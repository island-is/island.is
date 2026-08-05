export const RSK_TREATIES_URL =
  'https://www.skatturinn.is/einstaklingar/skattskylda/tviskottunarsamningar/'

export const SKATTURINN_BASE_URL = 'https://www.skatturinn.is'

export const ISLAND_IS_SEARCH_URL = 'https://island.is/stjornartidindi/leit'
export const ISLAND_IS_VIEWER_BASE_URL = 'https://island.is/stjornartidindi/nr'

export const TAB_SEARCH_KEYWORD: Record<'samningar' | 'upplysingaskipti', string> = {
  samningar: 'tvísköttunarsamning',
  upplysingaskipti: 'upplýsingaskiptasamning',
}

/**
 * Overrides the search query text for a country whose name is spelled, or
 * grammatically declined, differently in the official Stjórnartíðindi advert
 * title than on the RSK page (which always uses the nominative form). Found
 * by manually cross-checking search results during implementation — the
 * title-match filter only does a literal substring check, so any declinable
 * country name that ends up needing DocumentActions.aspx resolution needs an
 * entry here for its dative ("við X-u") form.
 */
export const SEARCH_QUERY_OVERRIDES: Record<string, string> = {
  'Bresku Jómfrúreyjar': 'Bresku Jómfrúaeyjar',
  Belgía: 'Belgíu',
}

/**
 * Overrides the exact advert title to match for a (country, document label)
 * pair whose official gazette title shares no vocabulary with the RSK page's
 * own label — bypasses the contains()-based matching entirely. Key is
 * `${name}::${documentLabel ?? ''}`.
 */
export const EXACT_TITLE_OVERRIDES: Record<string, string> = {
  'Mexíkó::Skip og loftför': 'AUGLÝSING um loftferðasamning við Mexíkó.',
}
