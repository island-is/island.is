import type { Lawyer } from '@island.is/judicial-system/types'

// The stored advocate carries no registry row id, so it is matched back to a
// registry entry by national id. The registry can list one national id twice,
// e.g. under an old and a new name, so the entry with the same name wins.
export const findSelectedLawyer = (
  lawyers: Lawyer[] | undefined,
  nationalId: string | null | undefined,
  name: string | null | undefined,
): Lawyer | undefined => {
  if (!nationalId || !lawyers) {
    return undefined
  }

  const matches = lawyers.filter((l) => l.nationalId === nationalId)

  return matches.find((l) => l.name === name) ?? matches[0]
}
