import { AuthGuard } from '../auth.guard'
import { environment } from '../../../../environments'

const { childServiceApiKeys } = environment

const authGuard = new AuthGuard()

describe('AuthGuard', () => {
  it('Api key should work for Ministry of welfaere', async () => {
    const request: any = {
      headers: {
        authorization: `bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      },
    }

    const isValid = authGuard.hasValidApiKey(request)

    expect(isValid).toBe(true)
  })

  it('Api key should not work with empty authorization header', async () => {
    const request: any = {
      headers: {},
    }

    const isValid = authGuard.hasValidApiKey(request)

    expect(isValid).toBe(false)
  })

  it('Api key should not work for invalid key', async () => {
    const request: any = {
      headers: {
        authorization: 'bearer invalidKey',
      },
    }

    const isValid = authGuard.hasValidApiKey(request)

    expect(isValid).toBe(false)
  })

  it('Api key should not work for empty key', async () => {
    const request: any = {
      headers: {
        authorization: 'bearer ',
      },
    }

    const isValid = authGuard.hasValidApiKey(request)

    expect(isValid).toBe(false)
  })

  it('Api key should not work when bearer is omitted', async () => {
    const request: any = {
      headers: {
        authorization: childServiceApiKeys.felagsmalaraduneytid,
      },
    }

    const isValid = authGuard.hasValidApiKey(request)

    expect(isValid).toBe(false)
  })
})
