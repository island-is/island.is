import { mapRannisGrant } from './rannisGrant.dto'
import { RannisGrantItem } from '../rannisGrants.types'

const baseItem = {
  fund_name: 'Sprotasjóður leik- grunn- og framhaldsskóla',
  datefrom: '2026-11-17 12:00:00',
  dateto: '2027-02-01 15:00:00',
  fund_url: 'https://www.rannis.is/sjodir/menntun/sprotasjodur/',
}

describe('mapRannisGrant', () => {
  it('maps numeric fundid and is_open to strings/booleans', () => {
    const item: RannisGrantItem = { ...baseItem, fundid: 71, is_open: 1 }

    const grant = mapRannisGrant(item)

    expect(grant?.id).toBe('71')
    expect(grant?.fundId).toBe('71')
    expect(grant?.isOpen).toBe(true)
    expect(grant?.dateFrom?.toISOString()).toBe('2026-11-17T12:00:00.000Z')
    expect(grant?.dateTo?.toISOString()).toBe('2027-02-01T15:00:00.000Z')
  })

  it('maps string fundid and is_open', () => {
    const item: RannisGrantItem = { ...baseItem, fundid: '71', is_open: '0' }

    const grant = mapRannisGrant(item)

    expect(grant?.id).toBe('71')
    expect(grant?.fundId).toBe('71')
    expect(grant?.isOpen).toBe(false)
  })

  it('prefers id over fundid and stringifies it', () => {
    const item: RannisGrantItem = {
      ...baseItem,
      id: 1234,
      fundid: 71,
      app_type: '1',
      app_type_name: 'Verkefnastyrkur',
      is_open: 1,
    }

    const grant = mapRannisGrant(item)

    expect(grant?.id).toBe('1234')
    expect(grant?.fundId).toBe('71')
  })

  it('drops items without an id', () => {
    const item = {
      ...baseItem,
      fundid: null,
      is_open: 1,
    } as unknown as RannisGrantItem

    expect(mapRannisGrant(item)).toBeUndefined()
  })
})
