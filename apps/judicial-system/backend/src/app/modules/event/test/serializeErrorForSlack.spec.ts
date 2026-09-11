import { BadGatewayException } from '@nestjs/common'

import { serializeErrorForSlack } from '../event.logic'

describe('serializeErrorForSlack', () => {
  it('includes name and message for a plain Error', () => {
    const error = new Error('Police API returned 400')

    expect(JSON.parse(serializeErrorForSlack(error))).toEqual({
      name: 'Error',
      message: 'Police API returned 400',
    })
  })

  it('keeps enumerable HttpException fields', () => {
    const error = new BadGatewayException({
      status: 400,
      message: 'Error while calling the court service',
      detail: 'Updated by another user',
    })

    expect(JSON.parse(serializeErrorForSlack(error))).toMatchObject({
      name: 'BadGatewayException',
      message: 'Error while calling the court service',
      status: 502,
      response: {
        status: 400,
        message: 'Error while calling the court service',
        detail: 'Updated by another user',
      },
    })
  })

  it('does not include stack', () => {
    const error = new Error('no stack please')

    expect(JSON.parse(serializeErrorForSlack(error))).not.toHaveProperty(
      'stack',
    )
  })
})
