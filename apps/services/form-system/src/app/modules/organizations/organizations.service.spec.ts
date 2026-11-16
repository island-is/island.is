import { AdminPortalScope } from '@island.is/auth/scopes'
import { User } from '@island.is/auth-nest-tools'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import { Sequelize } from 'sequelize-typescript'
import { Form } from '../forms/models/form.model'
import { Organization } from './models/organization.model'
import { OrganizationsService } from './organizations.service'
import { validate } from 'class-validator'
import { OrganizationLogoDto } from './models/dto/organizationLogo.dto'

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

  describe('OrganizationsService.updateLogo', () => {
    const nationalId = '1234567890'
    const logo = 'https://images.ctfassets.net/space/logo/organization.png'
    const transaction = { LOCK: { UPDATE: 'UPDATE' } }
    const findOne = jest.fn()
    const save = jest.fn()
    let service: OrganizationsService
    let organization: {
      nationalId: string
      logo: { is: string | null; en: string | null } | null
      save: typeof save
    }
    let user: User

    beforeEach(async () => {
      jest.clearAllMocks()
      organization = {
        nationalId,
        logo: { is: 'old-logo', en: 'english-logo' },
        save,
      }
      user = {
        nationalId,
        scope: [],
        authorization: '',
        client: '',
      }
      findOne.mockResolvedValue(organization)
      const module = await Test.createTestingModule({
        providers: [
          OrganizationsService,
          { provide: getModelToken(Organization), useValue: { findOne } },
          { provide: getModelToken(Form), useValue: {} },
          {
            provide: Sequelize,
            useValue: {
              transaction: (
                callback: (value: typeof transaction) => Promise<void>,
              ) => callback(transaction),
            },
          },
        ],
      }).compile()
      service = module.get(OrganizationsService)
    })

    it('saves logo.is and preserves logo.en for the organization owner', async () => {
      await service.updateLogo(user, { nationalId, logo })

      expect(organization.logo).toEqual({ is: logo, en: 'english-logo' })
      expect(findOne).toHaveBeenCalledWith({
        where: { nationalId },
        transaction,
        lock: transaction.LOCK.UPDATE,
      })
      expect(save).toHaveBeenCalledWith({ transaction })
    })

    it('allows an administrator to initialize a null logo', async () => {
      organization.logo = null
      user.nationalId = '0987654321'
      user.scope = [AdminPortalScope.formSystemAdmin]

      await service.updateLogo(user, { nationalId, logo })

      expect(organization.logo).toEqual({ is: logo, en: '' })
      expect(save).toHaveBeenCalledWith({ transaction })
    })

    it('clears logo.is while preserving logo.en', async () => {
      await service.updateLogo(user, { nationalId, logo: '' })

      expect(organization.logo).toEqual({ is: '', en: 'english-logo' })
      expect(save).toHaveBeenCalledWith({ transaction })
    })

    it('accepts an empty string logo', async () => {
      const dto = Object.assign(new OrganizationLogoDto(), {
        nationalId,
        logo: '',
      })

      await expect(validate(dto)).resolves.toEqual([])
    })

    it.each([undefined, null, 'not-a-url'])(
      'rejects an invalid or omitted logo (%s)',
      async (invalidLogo) => {
        const dto = Object.assign(new OrganizationLogoDto(), {
          nationalId,
          logo: invalidLogo,
        })

        expect(await validate(dto)).toEqual([
          expect.objectContaining({ property: 'logo' }),
        ])
      },
    )

    it('rejects updates to another organization', async () => {
      user.nationalId = '0987654321'

      await expect(
        service.updateLogo(user, { nationalId, logo }),
      ).rejects.toThrow(UnauthorizedException)
      expect(save).not.toHaveBeenCalled()
    })

    it('rejects missing organizations', async () => {
      findOne.mockResolvedValue(null)

      await expect(
        service.updateLogo(user, { nationalId, logo }),
      ).rejects.toThrow(NotFoundException)
      expect(save).not.toHaveBeenCalled()
    })

    it('propagates persistence failures', async () => {
      save.mockRejectedValueOnce(new Error('Database unavailable'))

      await expect(
        service.updateLogo(user, { nationalId, logo }),
      ).rejects.toThrow('Database unavailable')
    })
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
