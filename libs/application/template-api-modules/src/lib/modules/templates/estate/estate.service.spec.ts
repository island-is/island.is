import { createApplication } from '@island.is/application/testing'
import { ApplicationTypes } from '@island.is/application/types'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  SignatoryEstateTypes,
  type SyslumennService,
} from '@island.is/clients/syslumenn'
import type { S3Service } from '@island.is/nest/aws'
import type { Logger } from '@island.is/logging'

import type { TemplateApiModuleActionProps } from '../../../types'
import type { SharedTemplateApiService } from '../../shared'
import { EstateTemplateService } from './estate.service'
import { EstateTypes } from './consts'

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}

const mockSyslumennService = {
  getInheritanceReportSignatories: jest.fn(),
}

const createActionProps = (
  selectedEstate: string,
): TemplateApiModuleActionProps => ({
  application: createApplication({
    typeId: ApplicationTypes.ESTATE,
    answers: {
      selectedEstate,
      estateInfoSelection: 'CASE-001',
    },
    externalData: {
      syslumennOnEntry: {
        data: {
          estates: [
            {
              caseNumber: 'CASE-001',
              nationalIdOfDeceased: '0101307789',
            },
          ],
        },
        date: new Date(),
        status: 'success',
      },
    },
  }),
  auth: createCurrentUser({
    nationalId: '0101301234',
    scope: ['@island.is/applications:write'],
  }),
  currentUserLocale: 'is',
})

describe('EstateTemplateService', () => {
  let service: EstateTemplateService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new EstateTemplateService(
      mockLogger as unknown as Logger,
      mockSyslumennService as unknown as SyslumennService,
      {} as S3Service,
      {} as SharedTemplateApiService,
    )
  })

  describe('getSignatories', () => {
    it.each([
      EstateTypes.officialDivision,
      EstateTypes.estateWithoutAssets,
    ])('returns no signatories for %s without calling Syslumenn', async (type) => {
      const result = await service.getSignatories(createActionProps(type))

      expect(result).toEqual({ success: true, signatories: [] })
      expect(
        mockSyslumennService.getInheritanceReportSignatories,
      ).not.toHaveBeenCalled()
    })

    it('fetches signatories from Syslumenn for estate division by heirs', async () => {
      mockSyslumennService.getInheritanceReportSignatories.mockResolvedValue([
        { name: 'Heir A', nationalId: '0101302209', signed: false },
      ])

      const result = await service.getSignatories(
        createActionProps(EstateTypes.divisionOfEstateByHeirs),
      )

      expect(result).toEqual({
        success: true,
        signatories: [
          { name: 'Heir A', nationalId: '0101302209', signed: false },
        ],
      })
      expect(
        mockSyslumennService.getInheritanceReportSignatories,
      ).toHaveBeenCalledWith('0101307789', SignatoryEstateTypes.Einkaskipti)
    })
  })
})
