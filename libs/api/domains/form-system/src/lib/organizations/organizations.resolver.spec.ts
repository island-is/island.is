import { User } from '@island.is/auth-nest-tools'
import { OrganizationTitleByNationalIdDataLoader } from '@island.is/cms'
import { NotFoundException } from '@nestjs/common'
import { OrganizationsResolver } from './organizations.resolver'
import { OrganizationsService } from './organizations.service'

describe('OrganizationsResolver.createOrganization', () => {
  const createOrganization = jest.fn()
  const load = jest.fn()
  const resolver = new OrganizationsResolver({
    createOrganization,
  } as unknown as OrganizationsService)
  const loader = { load } as unknown as OrganizationTitleByNationalIdDataLoader
  const user = {} as User
  const input = { nationalId: '1234567890' }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it.each([null, '', '   '])(
    'does not create an organization when Contentful returns %s',
    async (title) => {
      load.mockResolvedValue(title)
      await expect(
        resolver.createOrganization(input, loader, user),
      ).rejects.toThrow(NotFoundException)
      expect(createOrganization).not.toHaveBeenCalled()
    },
  )

  it('does not create an organization when Contentful fails', async () => {
    load.mockRejectedValue(new Error('Contentful unavailable'))
    await expect(
      resolver.createOrganization(input, loader, user),
    ).rejects.toThrow('Contentful unavailable')
    expect(createOrganization).not.toHaveBeenCalled()
  })

  it('returns the Contentful name after saving the organization', async () => {
    load.mockResolvedValue('Stofnun')
    await expect(
      resolver.createOrganization(input, loader, user),
    ).resolves.toBe('Stofnun')
    expect(load).toHaveBeenCalledWith(input.nationalId)
    expect(createOrganization).toHaveBeenCalledWith(user, input)
  })

  it('propagates persistence errors instead of returning success', async () => {
    load.mockResolvedValue('Stofnun')
    createOrganization.mockRejectedValue(
      new Error('Organization already exists'),
    )
    await expect(
      resolver.createOrganization(input, loader, user),
    ).rejects.toThrow('Organization already exists')
  })
})
