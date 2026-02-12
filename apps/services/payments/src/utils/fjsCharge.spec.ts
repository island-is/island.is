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

  it('should calculate the amount as priceAmount * quantity', () => {
    const oneItemOneQuantity = [
      {
        chargeItemCode: 'A101',
        quantity: 1,
        chargeType: 'A',
        priceAmount: 1000,
      },
    ]

    const oneItemTwoQuantity = [
      {
        chargeItemCode: 'A101',
        quantity: 2,
        chargeType: 'A',
        priceAmount: 1000,
      },
    ]

    const twoItemsOneQuantity = [
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

    const twoItemsTwoQuantity = [
      {
        chargeItemCode: 'A101',
        quantity: 2,
        chargeType: 'A',
        priceAmount: 1000,
      },
      {
        chargeItemCode: 'B101',
        quantity: 2,
        chargeType: 'B',
        priceAmount: 1000,
      },
    ]

    const oneItemOneQuantityResult = generateChargeFJSPayload({
      ...sampleInput,
      charges: oneItemOneQuantity,
    })

    expect(oneItemOneQuantityResult.charges[0].priceAmount).toBe(1000)
    expect(oneItemOneQuantityResult.charges[0].amount).toBe(1000)
    expect(oneItemOneQuantityResult.charges[0].quantity).toBe(1)

    const oneItemTwoQuantityResultResult = generateChargeFJSPayload({
      ...sampleInput,
      charges: oneItemTwoQuantity,
    })

    expect(oneItemTwoQuantityResultResult.charges[0].priceAmount).toBe(1000)
    expect(oneItemTwoQuantityResultResult.charges[0].amount).toBe(2000)
    expect(oneItemTwoQuantityResultResult.charges[0].quantity).toBe(2)

    const twoItemsOneQuantityResult = generateChargeFJSPayload({
      ...sampleInput,
      charges: twoItemsOneQuantity,
    })

    expect(twoItemsOneQuantityResult.charges[0].priceAmount).toBe(1000)
    expect(twoItemsOneQuantityResult.charges[0].amount).toBe(1000)
    expect(twoItemsOneQuantityResult.charges[0].quantity).toBe(1)
    expect(twoItemsOneQuantityResult.charges[1].priceAmount).toBe(1000)
    expect(twoItemsOneQuantityResult.charges[1].amount).toBe(1000)
    expect(twoItemsOneQuantityResult.charges[1].quantity).toBe(1)

    const twoItemsTwoQuantityResult = generateChargeFJSPayload({
      ...sampleInput,
      charges: twoItemsTwoQuantity,
    })

    expect(twoItemsTwoQuantityResult.charges[0].priceAmount).toBe(1000)
    expect(twoItemsTwoQuantityResult.charges[0].amount).toBe(2000)
    expect(twoItemsTwoQuantityResult.charges[0].quantity).toBe(2)
    expect(twoItemsTwoQuantityResult.charges[1].priceAmount).toBe(1000)
    expect(twoItemsTwoQuantityResult.charges[1].amount).toBe(2000)
    expect(twoItemsTwoQuantityResult.charges[1].quantity).toBe(2)
  })
})
