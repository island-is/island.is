import jwt from 'jsonwebtoken'

import { JwtStrategy } from './jwt.strategy'
import { Request } from 'express'
import { JwtPayload } from './jwt.payload'
import { AuthDelegationType } from '@island.is/shared/types'

describe('JwtStrategy#validate', () => {
  let jwtStrategy: JwtStrategy
  let fakeRequest: Request
  let fakePayload: JwtPayload

  beforeEach(() => {
    jwtStrategy = new JwtStrategy({
      issuer: 'issuer',
      audience: 'audience',
    })

    fakeRequest = {
      headers: {
        authorization: 'Bearer authorization',
        'user-agent': 'test user agent',
      },
      ip: '1.1.1.1',
    } as Request

    fakePayload = {
      nationalId: '1234567890',
      sub: 'sub',
      sid: 'sid',
      scope: ['test-scope-1'],
      client_id: 'test-client',
      delegationType: [AuthDelegationType.Custom],
      actor: {
        nationalId: '1234564321',
        scope: ['test-scope-2'],
      },
    }
  })

  it('supports scopes as string array', async () => {
    // Arrange
    const payload = {
      ...fakePayload,
      scope: ['scope1', 'scope2'],
      actor: {
        ...fakePayload.actor!,
        scope: ['act1', 'act2'],
      },
    }

    // Act
    const user = await jwtStrategy.validate(fakeRequest, payload)

    // Assert
    expect(user.scope).toEqual(['scope1', 'scope2'])
    expect(user.actor!.scope).toEqual(['act1', 'act2'])
  })

  it('supports scopes as space separated string', async () => {
    // Arrange
    const payload = {
      ...fakePayload,
      scope: 'scope1 scope2',
      actor: {
        ...fakePayload.actor!,
        scope: 'act1 act2',
      },
    }

    // Act
    const user = await jwtStrategy.validate(fakeRequest, payload)

    // Assert
    expect(user.scope).toEqual(['scope1', 'scope2'])
    expect(user.actor!.scope).toEqual(['act1', 'act2'])
  })

  it('picks up request and jwt properties', async () => {
    // Arrange
    const payload: JwtPayload = {
      nationalId: '1234567890',
      scope: ['test-scope-1'],
      client_id: 'test-client',
      delegationType: [AuthDelegationType.Custom],
      actor: {
        nationalId: '1234565555',
        scope: ['test-scope-2'],
      },
      act: {
        client_id: 'test-client-2',
        act: {
          client_id: 'test-client-3',
        },
      },
    }
    const request = {
      headers: {
        authorization: 'Bearer authorization',
        'user-agent': 'test user agent',
        'x-forwarded-for': '2.2.2.2, 3.3.3.3',
      },
      ip: '1.1.1.1',
    } as unknown as Request

    // Act
    const user = await jwtStrategy.validate(request, payload)

    // Assert
    expect(user.nationalId).toEqual(payload.nationalId)
    expect(user.scope).toEqual(payload.scope)
    expect(user.client).toEqual(payload.client_id)
    expect(user.authorization).toEqual(request.headers.authorization)
    expect(user.ip).toEqual(request.headers['x-forwarded-for'])
    expect(user.userAgent).toEqual(request.headers['user-agent'])
    expect(user.actor!.nationalId).toEqual(payload.actor!.nationalId)
    expect(user.actor!.scope).toEqual(payload.actor!.scope)
    expect(user.act).toEqual(payload.act)
  })

  it('picks up the authentication event claims', async () => {
    // Arrange
    const authTime = 1755600000
    const payload: JwtPayload = {
      ...fakePayload,
      acr: 'eidas-loa-high',
      idp: 'audkenni_sim',
      auth_time: authTime,
    }

    // Act
    const user = await jwtStrategy.validate(fakeRequest, payload)

    // Assert
    expect(user.acr).toEqual('eidas-loa-high')
    expect(user.idp).toEqual('audkenni_sim')
    expect(user.authTime).toEqual(new Date(authTime * 1000))
  })

  it('leaves the authentication event claims undefined when absent', async () => {
    // Act
    const user = await jwtStrategy.validate(fakeRequest, fakePayload)

    // Assert
    expect(user.acr).toBeUndefined()
    expect(user.idp).toBeUndefined()
    expect(user.authTime).toBeUndefined()
  })

  it('picks up __accessToken field in request body', async () => {
    // Arrange
    const payload: JwtPayload = {
      nationalId: '1234567890',
      scope: ['test-scope-1'],
      client_id: 'test-client',
    }
    const request = {
      headers: {
        'user-agent': 'test user agent',
        'x-forwarded-for': '2.2.2.2, 3.3.3.3',
      },
      body: {
        __accessToken: 'some-token',
      },
    } as unknown as Request

    // Act
    const user = await jwtStrategy.validate(request, payload)

    // Assert
    expect(user.authorization).toEqual('Bearer some-token')
  })

  it('supports actor claim', async () => {
    // Arrange
    const payload: JwtPayload = {
      nationalId: '1234567890',
      scope: ['test-scope-1'],
      client_id: 'test-client',
      delegationType: [AuthDelegationType.Custom],
      actor: {
        nationalId: '1234564321',
        scope: ['test-scope-2'],
      },
    }

    // Act
    const user = await jwtStrategy.validate(fakeRequest, payload)

    // Assert
    expect(user.actor!.nationalId).toEqual(payload.actor!.nationalId)
    expect(user.actor!.scope).toEqual(payload.actor!.scope)
  })

  it('works when audience is omitted', async () => {
    const strategyWithoutAudience = new JwtStrategy({
      issuer: 'issuer',
    })
    const payload: JwtPayload = {
      nationalId: '1234567890',
      scope: ['test-scope-1'],
      client_id: 'test-client',
    }
    const user = await strategyWithoutAudience.validate(fakeRequest, payload)
    expect(user.nationalId).toEqual(payload.nationalId)
    expect(user.client).toEqual(payload.client_id)
  })

  it('picks up client_nationalId', async () => {
    const jwtStrategywithClientNationalId = new JwtStrategy({
      issuer: 'issuer',
      audience: 'audience',
      allowClientNationalId: true,
    })
    // Arrange
    const payload: JwtPayload = {
      scope: ['test-scope-1'],
      client_id: 'test-client',
      client_nationalId: '1234565555',
    }

    const personPayload: JwtPayload = {
      scope: ['test-scope-1'],
      client_id: 'test-client',
      nationalId: '1234567890',
    }

    // Act
    const user = await jwtStrategywithClientNationalId.validate(
      fakeRequest,
      payload,
    )

    const personUser = await jwtStrategywithClientNationalId.validate(
      fakeRequest,
      personPayload,
    )
    // Assert
    expect(user.nationalId).toEqual(payload.client_nationalId)
    expect(personUser.nationalId).toEqual('1234567890')
  })

  it('refuses a JWT that is not an access token, like a client attestation', async () => {
    const attestation = jwt.sign({ sub: '@island.is/app' }, 'secret', {
      header: { alg: 'HS256', typ: 'oauth-client-attestation+jwt' },
    })
    const request = {
      ...fakeRequest,
      headers: {
        ...fakeRequest.headers,
        authorization: `Bearer ${attestation}`,
      },
    } as Request

    await expect(jwtStrategy.validate(request, fakePayload)).rejects.toThrow(
      'Not an access token',
    )
  })

  it.each(['at+jwt', 'application/at+jwt', 'JWT', undefined])(
    'accepts an access token with typ %s',
    async (typ) => {
      const token = jwt.sign({ sub: 'sub' }, 'secret', {
        header: { alg: 'HS256', ...(typ && { typ }) },
      })
      const request = {
        ...fakeRequest,
        headers: { ...fakeRequest.headers, authorization: `Bearer ${token}` },
      } as Request

      const user = await jwtStrategy.validate(request, fakePayload)

      expect(user.authorization).toEqual(`Bearer ${token}`)
    },
  )

  it('checks a token sent in the body too', async () => {
    const attestation = jwt.sign({ sub: '@island.is/app' }, 'secret', {
      header: { alg: 'HS256', typ: 'oauth-client-attestation+jwt' },
    })
    const request = {
      headers: { 'user-agent': 'test user agent' },
      body: { __accessToken: attestation },
      ip: '1.1.1.1',
    } as unknown as Request

    await expect(jwtStrategy.validate(request, fakePayload)).rejects.toThrow(
      'Not an access token',
    )
  })
})
