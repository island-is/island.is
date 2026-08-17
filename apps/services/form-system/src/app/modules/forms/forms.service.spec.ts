import { ForbiddenException } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

import { FormResponseDto } from './models/dto/form.response.dto'
import { Form } from './models/form.model'
import { Organization } from '../organizations/models/organization.model'
import { FormsService } from './forms.service'

describe('FormsService', () => {
  const sourceOrganizationNationalId = '1111111119'
  const destinationOrganizationNationalId = '2222222229'
  const formId = 'form-id'

  let service: FormsService
  let organizationModel: { findOne: jest.Mock }

  const createUser = (nationalId: string, scope: string[] = []): User =>
    ({
      nationalId,
      scope,
    } as User)

  beforeEach(() => {
    organizationModel = {
      findOne: jest.fn(),
    }

    service = new FormsService(
      { unscoped: jest.fn() } as unknown as typeof Form,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      organizationModel as unknown as typeof Organization,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    )
  })

  describe('copy', () => {
    it('rejects non-admin source organization users copying to a different organization', async () => {
      const form = {
        id: formId,
        organizationNationalId: sourceOrganizationNationalId,
        slug: 'source-form',
      } as Form

      jest.spyOn(service, 'findById' as never).mockResolvedValue(form as never)
      const getUniqueCopySlug = jest.spyOn(
        service,
        'getUniqueCopySlug' as never,
      )
      const copyForm = jest.spyOn(service, 'copyForm' as never)

      await expect(
        service.copy(createUser(sourceOrganizationNationalId), formId, {
          organizationNationalId: destinationOrganizationNationalId,
        }),
      ).rejects.toBeInstanceOf(ForbiddenException)

      expect(organizationModel.findOne).not.toHaveBeenCalled()
      expect(getUniqueCopySlug).not.toHaveBeenCalled()
      expect(copyForm).not.toHaveBeenCalled()
    })

    it('allows admins to copy a form to a different organization', async () => {
      const form = {
        id: formId,
        organizationNationalId: sourceOrganizationNationalId,
        slug: 'source-form',
        isInaccessible: false,
      } as Form
      const destinationOrganization = {
        id: 'destination-organization-id',
        nationalId: destinationOrganizationNationalId,
      } as Organization
      const copiedForm = {
        id: 'copied-form-id',
      } as Form
      const response = { form: { id: copiedForm.id } } as FormResponseDto

      jest.spyOn(service, 'findById' as never).mockResolvedValue(form as never)
      jest
        .spyOn(service, 'getUniqueCopySlug' as never)
        .mockResolvedValue(
          `${destinationOrganizationNationalId}-${form.slug}` as never,
        )
      jest
        .spyOn(service, 'copyForm' as never)
        .mockResolvedValue(copiedForm as never)
      jest
        .spyOn(service, 'buildFormResponse' as never)
        .mockResolvedValue(response as never)
      organizationModel.findOne.mockResolvedValue(destinationOrganization)

      await expect(
        service.copy(
          createUser('3333333339', [AdminPortalScope.formSystemAdmin]),
          formId,
          {
            organizationNationalId: destinationOrganizationNationalId,
          },
        ),
      ).resolves.toBe(response)

      expect(organizationModel.findOne).toHaveBeenCalledWith({
        where: { nationalId: destinationOrganizationNationalId },
      })
      expect(service['getUniqueCopySlug']).toHaveBeenCalledWith(
        `${destinationOrganizationNationalId}-${form.slug}`,
      )
      expect(service['copyForm']).toHaveBeenCalledWith(
        formId,
        false,
        form.isInaccessible,
        `${destinationOrganizationNationalId}-${form.slug}`,
        destinationOrganization,
      )
    })

    it('uses a unique copy slug when copying within the same organization', async () => {
      const form = {
        id: formId,
        organizationNationalId: sourceOrganizationNationalId,
        slug: 'source-form',
        isInaccessible: false,
      } as Form
      const copiedForm = {
        id: 'copied-form-id',
      } as Form
      const response = { form: { id: copiedForm.id } } as FormResponseDto

      jest.spyOn(service, 'findById' as never).mockResolvedValue(form as never)
      jest
        .spyOn(service, 'getUniqueCopySlug' as never)
        .mockResolvedValue(`${form.slug}-afrit-2` as never)
      jest
        .spyOn(service, 'copyForm' as never)
        .mockResolvedValue(copiedForm as never)
      jest
        .spyOn(service, 'buildFormResponse' as never)
        .mockResolvedValue(response as never)

      await expect(
        service.copy(createUser(sourceOrganizationNationalId), formId, {
          organizationNationalId: sourceOrganizationNationalId,
        }),
      ).resolves.toBe(response)

      expect(organizationModel.findOne).not.toHaveBeenCalled()
      expect(service['getUniqueCopySlug']).toHaveBeenCalledWith(
        `${form.slug}-afrit`,
      )
      expect(service['copyForm']).toHaveBeenCalledWith(
        formId,
        false,
        form.isInaccessible,
        `${form.slug}-afrit-2`,
        undefined,
      )
    })
  })
})
