import { JwtStrategy } from './jwt.strategy'
import { Request } from 'express'
import { JwtPayload } from './jwt.payload'

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
        authorization: 'authorization',
        'user-agent': 'test user agent',
      },
      ip: '1.1.1.1',
    } as Request

    fakePayload = {
      nationalId: '1234567890',
      scope: ['test-scope-1'],
      client_id: 'test-client',
      act: {
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
      act: {
        ...fakePayload.act!,
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
      act: {
        ...fakePayload.act!,
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
      act: {
        nationalId: '1234565555',
        scope: ['test-scope-2'],
      },
    }
    const request = ({
      headers: {
        authorization: 'authorization',
        'user-agent': 'test user agent',
        'x-real-ip': '2.2.2.2',
      },
      ip: '1.1.1.1',
    } as unknown) as Request

    // Act
    const user = await jwtStrategy.validate(request, payload)

    // Assert
    expect(user.nationalId).toEqual(payload.nationalId)
    expect(user.scope).toEqual(payload.scope)
    expect(user.client).toEqual(payload.client_id)
    expect(user.authorization).toEqual(request.headers.authorization)
    expect(user.ip).toEqual(request.headers['x-real-ip'])
    expect(user.userAgent).toEqual(request.headers['user-agent'])
    expect(user.actor!.nationalId).toEqual(payload.act!.nationalId)
    expect(user.actor!.scope).toEqual(payload.act!.scope)
  })
})
