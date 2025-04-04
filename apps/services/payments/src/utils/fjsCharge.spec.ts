import { PayInfoPaymentMeansEnum } from '@island.is/clients/charge-fjs-v2'
import {
  generateChargeFJSPayload,
  GenerateChargeFJSPayloadInput,
} from './fjsCharge'

describe('generateChargeFJSPayload', () => {
  const sampleInput: GenerateChargeFJSPayloadInput = {
    paymentFlow: {
      id: '123',
      organisationId: '',
      payerNationalId: '',
    },
    charges: [
      {
        chargeItemCode: 'A101',
        quantity: 1,
        chargeType: 'A',
        priceAmount: 1000,
      },
    ],
    systemId: '',
    totalPrice: 1000,
  }

  it('it should include payInfo if passed as input', () => {
    const payInfo: GenerateChargeFJSPayloadInput['payInfo'] = {
      authCode: '123',
      PAN: '123',
      cardType: 'D',
      RRN: '123',
      payableAmount: 1000,
      paymentMeans: PayInfoPaymentMeansEnum.Debetkort,
    }

    const withoutPayinfo = generateChargeFJSPayload({
      ...sampleInput,
    })
    const withPayinfo = generateChargeFJSPayload({
      ...sampleInput,
      payInfo,
    })

    expect(withoutPayinfo.payInfo).toBeUndefined()
    expect(withPayinfo.payInfo).toEqual(payInfo)
  })

  it('should include extraData if passed as input', () => {
    const extraData: GenerateChargeFJSPayloadInput['paymentFlow']['extraData'] =
      [
        {
          name: 'testkey',
          value: 'test',
        },
      ]

    const withoutExtraData = generateChargeFJSPayload({
      ...sampleInput,
    })
    const withExtraData = generateChargeFJSPayload({
      ...sampleInput,
      paymentFlow: {
        ...sampleInput.paymentFlow,
        extraData,
      },
    })

    expect(withoutExtraData.extraData).toBeUndefined()
    expect(withExtraData.extraData).toEqual(extraData)
  })

  it('should make sure the id is no longer than 22 characters', () => {
    const paymentFlow = {
      id: '123456789012345678901234567890123456789012345678901234567890',
      organisationId: '',
      payerNationalId: '',
    }

    const result = generateChargeFJSPayload({
      ...sampleInput,
      paymentFlow,
    })

    expect(result.chargeItemSubject.length).not.toBe(paymentFlow.id.length)
    expect(result.chargeItemSubject).toHaveLength(22)
  })

  it('should put the chargeType as the first chargeType of charges', () => {
    const charges = [
      {
        chargeItemCode: 'A101',
        quantity: 1,
        chargeType: 'A',
        priceAmount: 1000,
      },
      {
        chargeItemCode: 'B101',
        quantity: 1,
        chargeType: 'B',
        priceAmount: 1000,
      },
    ]

    const result = generateChargeFJSPayload({
      ...sampleInput,
      charges,
    })

    expect(result.chargeType).toBe(charges[0].chargeType)
  })

  it('should use chargeItemSubjectId if it exists', () => {
    const chargeItemSubjectId = 'test test test'

    const input = {
      ...sampleInput,
      paymentFlow: {
        ...sampleInput.paymentFlow,
        chargeItemSubjectId,
      },
    }

    const result = generateChargeFJSPayload(input)
    expect(result.chargeItemSubject).toBe(chargeItemSubjectId)
    expect(result.chargeItemSubject).not.toBe(input.paymentFlow.id)
  })
})
