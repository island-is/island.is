import type { LawyerFull } from '@island.is/judicial-system/types'

/**
 * Whether an LMFÍ lawyer record indicates rights to appear before Landsréttur.
 *
 * Working hypothesis from the public LMFÍ directory copy: `Title` names the
 * courts the lawyer may appear before, e.g. "…fyrir héraðsdómstólum, Landsrétti
 * og Hæstarétti".
 *
 * TODO(LMFÍ): Confirm against a live `/api/lawyers` payload. If `Title` is
 * empty or unstructured in the API, switch to `HrlLicense` (or an official
 * LMFÍ query filter analogous to `?verjendur=1`) once that mapping is known.
 */
export const hasCourtOfAppealsRights = (
  lawyer: Pick<LawyerFull, 'Title' | 'HrlLicense'>,
): boolean => {
  if (typeof lawyer.Title === 'string' && lawyer.Title.includes('Landsrétti')) {
    return true
  }

  return false
}
