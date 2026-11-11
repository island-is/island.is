import { ExternalData, FormValue } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { AddressDeliveryType } from '../shared'
import { getLegalDomicileAddress } from './getAddressString'
import { getChargeItems } from './getChargeItems'
import {
  getApplicantOverviewItems,
  getCardDeliveryOverviewItems,
} from './getOverviewItems'

const createExternalData = (address?: Record<string, string>): ExternalData =>
  ({
    identity: {
      data: { address },
      date: new Date(),
      status: 'success',
    },
  } as unknown as ExternalData)

describe('getLegalDomicileAddress', () => {
  it('returns street, postal code and city', () => {
    const externalData = createExternalData({
      streetAddress: 'Laugavegur 1',
      postalCode: '101',
      city: 'Reykjavík',
    })
    expect(getLegalDomicileAddress(externalData)).toBe(
      'Laugavegur 1, 101 Reykjavík',
    )
  })

  it('returns only the street when postal code and city are missing', () => {
    const externalData = createExternalData({ streetAddress: 'Laugavegur 1' })
    expect(getLegalDomicileAddress(externalData)).toBe('Laugavegur 1')
  })

  it('returns empty string when there is no street address', () => {
    const externalData = createExternalData({
      postalCode: '101',
      city: 'Reykjavík',
    })
    expect(getLegalDomicileAddress(externalData)).toBe('')
  })

  it('returns empty string when identity data is missing', () => {
    expect(getLegalDomicileAddress({} as ExternalData)).toBe('')
  })
})

describe('getChargeItems', () => {
  it('returns a single card reissue charge item', () => {
    expect(getChargeItems()).toEqual([
      {
        code: ChargeItemCode.AOSH_MACHINE_LICENSE_CARD_REISSUE.toString(),
        quantity: 1,
      },
    ])
  })
})

describe('getApplicantOverviewItems', () => {
  it('maps applicant answers into overview values', () => {
    const answers: FormValue = {
      applicant: {
        name: 'Jón Jónsson',
        nationalId: '0101302989',
        address: 'Laugavegur 1',
        postalCode: '101',
        city: 'Reykjavík',
        email: 'jon@example.com',
        phoneNumber: '5555555',
      },
    }
    const [item] = getApplicantOverviewItems(answers)
    const values = (item.valueText as Array<{ values: { value: string } }>).map(
      (v) => v.values.value,
    )
    expect(values).toEqual([
      'Jón Jónsson',
      '0101302989',
      'Laugavegur 1, 101 Reykjavík',
      'jon@example.com',
      '5555555',
    ])
  })

  it('handles missing applicant answers', () => {
    const [item] = getApplicantOverviewItems({})
    const values = (item.valueText as Array<{ values: { value: string } }>).map(
      (v) => v.values.value,
    )
    expect(values).toEqual(['', '', '', '', ''])
  })
})

describe('getCardDeliveryOverviewItems', () => {
  const externalData = createExternalData({
    streetAddress: 'Laugavegur 1',
    postalCode: '101',
    city: 'Reykjavík',
  })

  it('shows the legal domicile when delivering to current address', () => {
    const answers: FormValue = {
      cardDelivery: { type: AddressDeliveryType.CURRENT },
    }
    const [item] = getCardDeliveryOverviewItems(answers, externalData)
    expect(item.valueText).toMatchObject({
      values: { address: 'Laugavegur 1, 101 Reykjavík' },
    })
  })

  it('shows the other address and recipient when delivering elsewhere', () => {
    const answers: FormValue = {
      cardDelivery: {
        type: AddressDeliveryType.OTHER,
        address: 'Skólavörðustígur 2',
        postalCodeAndCity: '101 Reykjavík',
        recipient: 'Anna Jónsdóttir',
      },
    }
    const [item] = getCardDeliveryOverviewItems(answers, externalData)
    expect(item.valueText).toEqual([
      expect.objectContaining({
        values: { address: 'Skólavörðustígur 2, 101 Reykjavík' },
      }),
      expect.objectContaining({ values: { value: 'Anna Jónsdóttir' } }),
    ])
  })

  it('omits the recipient line when no recipient is given', () => {
    const answers: FormValue = {
      cardDelivery: {
        type: AddressDeliveryType.OTHER,
        address: 'Skólavörðustígur 2',
        postalCodeAndCity: '101 Reykjavík',
      },
    }
    const [item] = getCardDeliveryOverviewItems(answers, externalData)
    expect(item.valueText).toHaveLength(1)
  })
})
