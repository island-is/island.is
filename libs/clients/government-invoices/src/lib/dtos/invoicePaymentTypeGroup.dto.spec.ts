import { PaymentTypeGroupResponseDto } from '../../../gen/fetch'
import { mapInvoicePaymentTypeGroupDto } from './invoicePaymentTypeGroup.dto'

const baseData: PaymentTypeGroupResponseDto = {
  name: 'Ferðakostnaður',
  codes: ['A12', 'A13', 'B04'],
  codeCount: 3,
}

describe('mapInvoicePaymentTypeGroupDto', () => {
  it('maps every declared field', () => {
    const result = mapInvoicePaymentTypeGroupDto(baseData)

    expect(result).toEqual({
      name: 'Ferðakostnaður',
      codes: ['A12', 'A13', 'B04'],
      codeCount: 3,
    })
  })

  it('drops the group when name is missing', () => {
    expect(
      mapInvoicePaymentTypeGroupDto({ ...baseData, name: null }),
    ).toBeNull()
  })

  it('keeps the group when codes is null, falling back to an empty array', () => {
    const result = mapInvoicePaymentTypeGroupDto({ ...baseData, codes: null })

    expect(result?.codes).toEqual([])
  })

  it('leaves codeCount undefined rather than deriving it from codes', () => {
    const result = mapInvoicePaymentTypeGroupDto({
      ...baseData,
      codeCount: null,
    })

    expect(result?.codeCount).toBeUndefined()
  })
})
