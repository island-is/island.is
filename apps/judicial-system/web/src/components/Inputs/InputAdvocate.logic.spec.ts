import type { Lawyer } from '@island.is/judicial-system/types'

import { findSelectedLawyer } from './InputAdvocate.logic'

const oldName: Lawyer = {
  id: 'row-old',
  name: 'Prufa Gamladóttir',
  practice: '',
  email: 'shared@dummy.dd',
  phoneNr: '0000001',
  nationalId: '0000000001',
  isLitigator: false,
}

const newName: Lawyer = {
  ...oldName,
  id: 'row-new',
  name: 'Prufa Nýjadóttir',
}

const other: Lawyer = {
  id: 'row-other',
  name: 'Þórður Prufuson',
  practice: '',
  email: '',
  phoneNr: '0000002',
  nationalId: '0000000002',
  isLitigator: false,
}

const lawyers = [oldName, newName, other]

describe('findSelectedLawyer', () => {
  it('finds the entry by national id', () => {
    expect(findSelectedLawyer(lawyers, other.nationalId, other.name)).toBe(
      other,
    )
  })

  it('prefers the entry with the stored name when a national id is listed twice', () => {
    expect(findSelectedLawyer(lawyers, newName.nationalId, newName.name)).toBe(
      newName,
    )
    expect(findSelectedLawyer(lawyers, oldName.nationalId, oldName.name)).toBe(
      oldName,
    )
  })

  it('falls back to the first entry when no name matches', () => {
    expect(
      findSelectedLawyer(lawyers, oldName.nationalId, 'Some Other Name'),
    ).toBe(oldName)
  })

  it('returns nothing without a national id or a registry', () => {
    expect(findSelectedLawyer(lawyers, null, other.name)).toBeUndefined()
    expect(
      findSelectedLawyer(undefined, other.nationalId, other.name),
    ).toBeUndefined()
  })
})
