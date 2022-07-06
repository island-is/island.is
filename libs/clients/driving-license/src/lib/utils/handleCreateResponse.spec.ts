import { handleCreateResponse } from './handleCreateResponse'
import * as faker from 'faker'

describe('handleCreateResponse', () => {
  it('should handle documented response type', () => {
    expect(
      handleCreateResponse(faker.datatype.number().toString()),
    ).toMatchObject({
      success: true,
    })
  })

  it('should handle actual response type', () => {
    expect(
      handleCreateResponse(`{"value": ${faker.datatype.number()} }`),
    ).toMatchObject({
      success: true,
    })
  })

  it('should handle error string response as error', () => {
    const result = handleCreateResponse(faker.datatype.string(20))
    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('should handle v1 type of response as well', () => {
    expect(handleCreateResponse('')).toMatchObject({
      success: true,
    })
  })
})
