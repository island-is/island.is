import { AuthGuard } from '../../auth.guard'
import { environment } from '../../../../../environments'

const { airlineApiKeys } = environment

const authGuard = new AuthGuard()

describe('AuthGuard', () => {
  it('Api key should work for Ernir', async () => {
    const request: any = {
      headers: {
        authorization: `bearer ${airlineApiKeys.ernir}`,
      },
    }

    const isValid = authGuard.hasValidApiKey(request)

    expect(isValid).toBe(true)
  })

  it('Api key should work for Icelandair', async () => {
    const request: any = {
      headers: {
        authorization: `bearer ${airlineApiKeys.icelandair}`,
      },
    }

    const isValid = authGuard.hasValidApiKey(request)

    expect(isValid).toBe(true)
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
})
