import { HttpStatus } from '@nestjs/common'

import {NoContentException} from '@island.is/nest/problem'

import { CreateRequest, setup } from './test/setup'

describe('NoContentExceptionFilter', () => {
  let request: CreateRequest

  beforeAll(async () => {
    ;[request] = await setup({
      handler: () => {
        throw new NoContentException()
      },
    })
  })

  it('returns 204 No Content response and empty body', async () => {
    // Act
    const response = await request()

    // Assert
    expect(response.status).toBe(HttpStatus.NO_CONTENT)
    expect(response.body).toStrictEqual({})
  })
})
