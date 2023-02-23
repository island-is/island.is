import {
  mapErrorMessageToActionStatusCode,
  mapPassToPassDataInput,
  mergeInputFields,
} from './typeMapper'
import ValidPass from './__mock-data__/validPass.json'
import ValidUpdatedPassDataInput from './__mock-data__/validUpdatedPassDataInput.json'
import ValidPassDataInput from './__mock-data__/validPassDataInput.json'
import ValidPassNoInputValues from './__mock-data__/validPassNoInputValues.json'
import { Pass, PassDataInput } from '../../gen/schema'

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
      const pass = (ValidPassNoInputValues as unknown) as Pass

      const result = mapPassToPassDataInput(pass)

      expect(result).toStrictEqual(pass)
    })

    it('should convert the pass to passInputdata, with the input values', () => {
      const pass = (ValidPass as unknown) as Pass
      const expectedResult = (ValidPassDataInput as unknown) as PassDataInput

      const result = mapPassToPassDataInput(pass)

      expect(result).toStrictEqual(expectedResult)
    })
  })

  describe('merge input fields', () => {
    it('should merge the inputs', () => {
      const pass = (ValidPassDataInput as unknown) as PassDataInput
      const payload = {
        inputFieldValues: [
          {
            identifier: 'gildir',
            value: '30.01.2024',
          },
          {
            identifier: 'name',
            value: 'TESTI MANNI',
          },
        ],
      }

      const result = mergeInputFields(
        pass.inputFieldValues ?? [],
        payload.inputFieldValues,
      )

      const expectedResult = (ValidUpdatedPassDataInput as unknown) as PassDataInput
      expect(result).toStrictEqual(expectedResult.inputFieldValues)
    })
    it('should return the original if the updated payload is missing', () => {
      const pass = (ValidPassDataInput as unknown) as PassDataInput

      const inputValues = pass.inputFieldValues ?? []

      const result = mergeInputFields(inputValues)

      expect(result).toStrictEqual(inputValues)
    })
    it('should return the payload if the original is missing', () => {
      const payload = ({
        inputFieldValues: [
          {
            identifier: 'gildir',
            value: '30.01.2024',
          },
          {
            identifier: 'name',
            value: 'TESTI MANNI',
          },
        ],
      } as unknown) as PassDataInput

      const result = mergeInputFields(undefined, payload.inputFieldValues ?? [])

      expect(result).toStrictEqual(payload.inputFieldValues ?? [])
    })

    it('should return null if both arguments are undefined', () => {
      const result = mergeInputFields(undefined, undefined)

      expect(result).toBeNull()
    })
  })
})
