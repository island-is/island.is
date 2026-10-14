import { UnauthorizedException } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'

import { OrganizationsService } from './organizations.service'
import { LanguageType } from '../../dataTypes/languageType.model'

describe('OrganizationsService organization metadata', () => {
  const user = { nationalId: '1234567890', scope: [] } as unknown as User
  const transaction = {}
  let service: OrganizationsService
  let organization: {
    id: string
    nationalId: string
    name: LanguageType
    logo: string
    save: jest.Mock
  }

  beforeEach(() => {
    organization = {
      id: 'organization-id',
      nationalId: user.nationalId,
      name: { is: 'Previous Icelandic name', en: 'Previous English name' },
      logo: 'https://example.com/previous.png',
      save: jest.fn().mockResolvedValue(undefined),
    }
    service = Object.assign(Object.create(OrganizationsService.prototype), {
      organizationModel: {
        findByPk: jest.fn().mockResolvedValue(organization),
      },
      sequelize: {
        transaction: jest.fn(async (callback) => callback(transaction)),
      },
    })
  })

  it('persists the Contentful name and logo on the organization', async () => {
    await service.updateZendeskInstance(user, {
      organizationId: organization.id,
      name: { is: 'Icelandic organization', en: 'English organization' },
      logo: 'https://images.ctfassets.net/logo.png',
    })

    expect(organization.name).toEqual({
      is: 'Icelandic organization',
      en: 'English organization',
    })
    expect(organization.logo).toBe('https://images.ctfassets.net/logo.png')
    expect(organization.save).toHaveBeenCalledWith({ transaction })
  })

  it('preserves metadata when the caller omits it', async () => {
    await service.updateZendeskInstance(user, {
      organizationId: organization.id,
    })

    expect(organization.name).toEqual({
      is: 'Previous Icelandic name',
      en: 'Previous English name',
    })
    expect(organization.logo).toBe('https://example.com/previous.png')
  })

  it('rejects metadata updates from another organization', async () => {
    await expect(
      service.updateZendeskInstance(
        { ...user, nationalId: '0987654321' },
        {
          organizationId: organization.id,
          name: { is: 'Unauthorized name', en: 'Unauthorized name' },
        },
      ),
    ).rejects.toThrow(UnauthorizedException)

    expect(organization.name).toEqual({
      is: 'Previous Icelandic name',
      en: 'Previous English name',
    })
    expect(organization.save).not.toHaveBeenCalled()
  })
})
