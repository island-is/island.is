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

  it('Api key should work for Norlandair', async () => {
    const request: any = {
      headers: {
        authorization: `bearer ${airlineApiKeys.norlandair}`,
      },
    }

    const isValid = authGuard.hasValidApiKey(request)

    expect(isValid).toBe(true)
  })

  it('Api key should work for Myflug', async () => {
    const request: any = {
      headers: {
        authorization: `bearer ${airlineApiKeys.myflug}`,
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
        authorization: airlineApiKeys.icelandair,
      },
    }

    const isValid = authGuard.hasValidApiKey(request)

    expect(isValid).toBe(false)
  })
})
