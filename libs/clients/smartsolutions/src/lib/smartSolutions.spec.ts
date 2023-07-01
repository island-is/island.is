import {
  mapErrorMessageToActionStatusCode,
  mapPassToPassDataInput,
  mergeInputFields,
} from './typeMapper'
import ValidPass from './__mock-data__/validPass.json'
import ValidPassDataInput from './__mock-data__/validPassDataInput.json'
import ValidPassNoInputValues from './__mock-data__/validPassNoInputValues.json'
import { Pass, PassInputFieldValueDataInput } from '../../gen/schema'

describe('smart-solutions-api', () => {
  // Since the client needs to be refactored out of the service, test the
  // logic independantly via the static method
  // See readme for rules
  describe('map error message to code', () => {
    it('should return 99 if no arg', async () => {
      const result = mapErrorMessageToActionStatusCode()
      expect(result).toBe(99)
    })

    it('should return 4 if invalid arguments', async () => {
      const result = mapErrorMessageToActionStatusCode(
        'Missing following mandatory inputfields 8430qhgouhergjnl',
      )
      expect(result).toBe(4)
    })

    it('should return 3 if expired barcode', async () => {
      const result = mapErrorMessageToActionStatusCode(
        'Invalid barcode. Please try to refresh the pass',
      )
      expect(result).toBe(99)
    })
  })

  describe('map Pass to PassDataInput', () => {
    it('should convert the pass to passInputData and no other changes, if the pass has no input values', () => {
      const pass = ValidPassNoInputValues as unknown as Pass

      const result = mapPassToPassDataInput(pass)

      expect(result).toStrictEqual(pass)
    })

    it('should convert the pass to passInputdata, with the input values', () => {
      const pass = ValidPass as unknown as Pass
      const expectedResult =
        ValidPassDataInput as unknown as Array<PassInputFieldValueDataInput>

      const result = mapPassToPassDataInput(pass)

      expect(result.inputFieldValues).toStrictEqual(expectedResult)
    })
  })

  describe('merge input fields', () => {
    it('should only update provided fields', () => {
      const originalValues =
        ValidPassDataInput as unknown as Array<PassInputFieldValueDataInput>
      const payload = [
        {
          identifier: 'gildir',
          value: '9908.789.2024',
        },
      ]

      const result = mergeInputFields(originalValues, payload)
      const expectedResult = [
        {
          identifier: 'gildir',
          value: '9908.789.2024',
        },
        {
          identifier: 'name',
          value: 'BINGG',
        },
        {
          identifier: 'kennitala',
          value: '0102491479',
        },
      ]

      expect(result).toStrictEqual(expectedResult)
    })
    it('should add all extra fields if the updated has more', () => {
      const originalValues =
        ValidPassDataInput as unknown as Array<PassInputFieldValueDataInput>
      const payload = [
        {
          identifier: 'gildir',
          value: '9908.789.2024',
        },
        {
          identifier: 'nickname',
          value: 'NIKKI MANNI',
        },
        {
          identifier: 'kennitala',
          value: 'TEST',
        },
        {
          identifier: 'testField',
          value: 'bing bongds',
        },
      ]

      const result = mergeInputFields(originalValues, payload)

      const expectedResult = [
        {
          identifier: 'gildir',
          value: '9908.789.2024',
        },
        {
          identifier: 'name',
          value: 'BINGG',
        },
        {
          identifier: 'kennitala',
          value: 'TEST',
        },
        {
          identifier: 'nickname',
          value: 'NIKKI MANNI',
        },
        {
          identifier: 'testField',
          value: 'bing bongds',
        },
      ]
      expect(result).toStrictEqual(expectedResult)
    })
    it('should return the payload if the original is missing', () => {
      const payload = [
        {
          identifier: 'gildir',
          value: '30.01.2024',
        },
        {
          identifier: 'name',
          value: 'TESTI MANNI',
        },
      ] as Array<PassInputFieldValueDataInput>

      const result = mergeInputFields(undefined, payload)

      expect(result).toStrictEqual(payload)
    })

    it('should return the original if no payload', () => {
      const originalValues =
        ValidPassDataInput as unknown as Array<PassInputFieldValueDataInput>

      const result = mergeInputFields(originalValues, [])

      expect(result).toStrictEqual(originalValues)
    })

    it('should return null if both arguments are undefined', () => {
      const result = mergeInputFields(undefined, undefined)

      expect(result).toBeNull()
    })
  })
})
