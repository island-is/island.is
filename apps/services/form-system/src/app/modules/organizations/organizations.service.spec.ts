import { BadRequestException } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'

import { Form } from '../forms/models/form.model'
import { Organization } from './models/organization.model'
import { OrganizationsService } from './organizations.service'

describe('OrganizationsService', () => {
  const organizationId = 'organization-id'
  const organizationNationalId = '1111111119'
  const formId = 'form-id'

  let service: OrganizationsService
  let organizationModel: { findByPk: jest.Mock }
  let formModel: { findByPk: jest.Mock }
  let transaction: Record<string, never>

  const createUser = (nationalId: string): User =>
    ({
      nationalId,
      scope: [],
    } as unknown as User)

  beforeEach(() => {
    organizationModel = {
      findByPk: jest.fn(),
    }
    formModel = {
      findByPk: jest.fn(),
    }
    transaction = {}

    service = new OrganizationsService(
      organizationModel as unknown as typeof Organization,
      formModel as unknown as typeof Form,
      {
        transaction: jest.fn((callback) => callback(transaction)),
      } as never,
    )
  })

  describe('updateZendeskInstance', () => {
    it('persists unsupported Zendesk tenants before reporting them as unsupported', async () => {
      const organization = {
        id: organizationId,
        nationalId: organizationNationalId,
        zendeskInstance: '',
        save: jest.fn(),
      }
      const form = {
        organizationId,
        zendeskBrandId: '',
        save: jest.fn(),
      }

      organizationModel.findByPk.mockResolvedValue(organization)
      formModel.findByPk.mockResolvedValue(form)

      await expect(
        service.updateZendeskInstance(createUser(organizationNationalId), {
          organizationId,
          formId,
          zendeskInstance: ' unsupported ',
          zendeskBrandId: '123',
        }),
      ).rejects.toBeInstanceOf(BadRequestException)

      expect(organization.zendeskInstance).toBe('unsupported')
      expect(organization.save).toHaveBeenCalledWith({ transaction })
      expect(form.zendeskBrandId).toBe('123')
      expect(form.save).toHaveBeenCalledWith({ transaction })
    })
  })
})
