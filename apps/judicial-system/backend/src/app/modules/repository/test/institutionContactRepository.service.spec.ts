import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  DefendantNotificationType,
  IndictmentCaseNotificationType,
} from '@island.is/judicial-system/types'

import { InstitutionContact } from '../models/institutionContact.model'
import { InstitutionContactRepositoryService } from '../services/institutionContactRepository.service'

describe('InstitutionContactRepositoryService', () => {
  const institutionId = 'a5f7e3d1-0000-4000-8000-000000000001'

  let service: InstitutionContactRepositoryService
  let model: { findOne: jest.Mock }

  beforeEach(async () => {
    model = { findOne: jest.fn().mockResolvedValue(null) }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(InstitutionContact), useValue: model },
        InstitutionContactRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(InstitutionContactRepositoryService)
  })

  describe('getInstitutionContact', () => {
    it('returns the contact value for the institution and notification type', async () => {
      model.findOne.mockResolvedValueOnce({ value: 'contact@example.com' })

      const result = await service.getInstitutionContact(
        institutionId,
        IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
      )

      expect(model.findOne).toHaveBeenCalledWith({
        where: {
          institutionId,
          type: IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
        },
      })
      expect(result).toBe('contact@example.com')
    })

    it('returns null when no contact matches', async () => {
      model.findOne.mockResolvedValueOnce(null)

      const result = await service.getInstitutionContact(
        institutionId,
        DefendantNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN,
      )

      expect(result).toBeNull()
    })

    it('returns null without querying when no institution id is provided', async () => {
      const result = await service.getInstitutionContact(
        '',
        DefendantNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN,
      )

      expect(model.findOne).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('returns null rather than throwing when the query fails', async () => {
      model.findOne.mockRejectedValueOnce(new Error('Some error'))

      const result = await service.getInstitutionContact(
        institutionId,
        DefendantNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN,
      )

      expect(result).toBeNull()
    })
  })
})
