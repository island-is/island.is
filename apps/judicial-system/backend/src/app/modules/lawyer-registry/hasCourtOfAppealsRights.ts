import type { LawyerFull } from '@island.is/judicial-system/types'

// LMFÍ Title codes for court appearance rights:
// - hdl. — héraðsdómstólar only
// - lrl. — Landsréttur (and district courts)
// - hrl. — Hæstiréttur (implies Landsréttur as well)
const COURT_OF_APPEALS_TITLES = new Set(['lrl.', 'hrl.'])

/**
 * Whether an LMFÍ lawyer record indicates rights to appear before Landsréttur.
 */
export const hasCourtOfAppealsRights = (
  lawyer: Pick<LawyerFull, 'Title'>,
): boolean => {
  if (typeof lawyer.Title !== 'string') {
    return false
  }

  return COURT_OF_APPEALS_TITLES.has(lawyer.Title.trim().toLowerCase())
}
