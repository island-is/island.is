import { AdminPortalScope } from '@island.is/auth/scopes'
import { User } from '@island.is/auth-nest-tools'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
import { Organization } from './models/organization.model'
import { OrganizationsService } from './organizations.service'

describe('OrganizationsService.create', () => {
  const originalEnvironment = process.env.name
  const originalNodeEnvironment = process.env.NODE_ENV
  const findOrCreate = jest.fn()
  const service = new OrganizationsService(
    { findOrCreate } as unknown as typeof Organization,
    undefined as never,
    undefined as never,
  )
  const admin = { scope: [AdminPortalScope.formSystemAdmin] } as User
  const nationalId = '1234567890'

  beforeEach(() => {
    process.env.name = 'dev'
    process.env.NODE_ENV = 'test'
    findOrCreate.mockReset()
  })

  afterAll(() => {
    if (originalEnvironment === undefined) {
      delete process.env.name
    } else {
      process.env.name = originalEnvironment
    }
    if (originalNodeEnvironment === undefined) {
      delete process.env.NODE_ENV
    } else {
      process.env.NODE_ENV = originalNodeEnvironment
    }
  })

  it.each(['production', 'staging', undefined])(
    'rejects creation in %s',
    async (environment) => {
      if (environment === undefined) {
        delete process.env.name
      } else {
        process.env.name = environment
      }
      await expect(service.create(admin, nationalId)).rejects.toThrow(
        ForbiddenException,
      )
      expect(findOrCreate).not.toHaveBeenCalled()
    },
  )

  it('rejects non-admin users', async () => {
    await expect(
      service.create({ scope: [] } as unknown as User, nationalId),
    ).rejects.toThrow(UnauthorizedException)
    expect(findOrCreate).not.toHaveBeenCalled()
  })

  it.each(['production', 'prod', 'staging'])(
    'rejects %s even with a development build',
    async (environment) => {
      process.env.name = environment
      process.env.NODE_ENV = 'development'

      await expect(service.create(admin, nationalId)).rejects.toThrow(
        ForbiddenException,
      )
      expect(findOrCreate).not.toHaveBeenCalled()
    },
  )

  it.each([undefined, 'local'])(
    'allows local development with environment %s',
    async (environment) => {
      if (environment === undefined) {
        delete process.env.name
      } else {
        process.env.name = environment
      }
      process.env.NODE_ENV = 'development'
      findOrCreate.mockResolvedValue([{}, true])

      await expect(service.create(admin, nationalId)).resolves.toBeUndefined()
      expect(findOrCreate).toHaveBeenCalledWith({ where: { nationalId } })
    },
  )

  it('rejects local creation in a production build', async () => {
    process.env.name = 'local'
    process.env.NODE_ENV = 'production'

    await expect(service.create(admin, nationalId)).rejects.toThrow(
      ForbiddenException,
    )
    expect(findOrCreate).not.toHaveBeenCalled()
  })

  it('rejects invalid national IDs', async () => {
    await expect(service.create(admin, '123')).rejects.toThrow(
      BadRequestException,
    )
    expect(findOrCreate).not.toHaveBeenCalled()
  })

  it('rejects existing organizations', async () => {
    findOrCreate.mockResolvedValue([{}, false])
    await expect(service.create(admin, nationalId)).rejects.toThrow(
      ConflictException,
    )
  })

  it('creates an organization in development', async () => {
    findOrCreate.mockResolvedValue([{}, true])
    await expect(service.create(admin, nationalId)).resolves.toBeUndefined()
    expect(findOrCreate).toHaveBeenCalledWith({ where: { nationalId } })
  })
})
