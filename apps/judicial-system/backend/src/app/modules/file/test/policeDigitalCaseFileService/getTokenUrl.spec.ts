import { Sequelize } from 'sequelize-typescript'

import { NotFoundException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'

import { type User } from '@island.is/judicial-system/types'

import { AwsS3Service } from '../../../aws-s3'
import { PoliceService } from '../../../police/police.service'
import {
  CaseFileRepositoryService,
  CourtDocumentRepositoryService,
  PoliceDigitalCaseFileRepositoryService,
} from '../../../repository'
import { PoliceDigitalCaseFileService } from '../../policeDigitalCaseFiles/policeDigitalCaseFile.service'

const caseId = 'case-1'
const policeCaseNumber = '007-2024-1234'
const policeDigitalFileId = 'digital-file-1'
const user = { nationalId: '0000000000' } as User
const caseNumbers = {
  courtCaseNumber: 'S-1/2026',
  policeCaseNumbers: [policeCaseNumber],
}
const url = 'https://police.example/token'

const makeStoredPoliceDigitalCaseFile = (
  overrides: { policeDigitalFileId?: string; policeCaseNumber?: string } = {},
) => ({
  id: 'stored-1',
  caseId,
  policeCaseNumber,
  policeDigitalFileId,
  ...overrides,
})

describe('PoliceDigitalCaseFileService - getTokenUrl', () => {
  let policeDigitalCaseFileRepositoryService: jest.Mocked<PoliceDigitalCaseFileRepositoryService>
  let policeService: jest.Mocked<PoliceService>
  let service: PoliceDigitalCaseFileService

  beforeEach(() => {
    policeDigitalCaseFileRepositoryService = {
      findByCaseId: jest.fn(),
    } as unknown as jest.Mocked<PoliceDigitalCaseFileRepositoryService>

    policeService = {
      getTokenUrl: jest.fn().mockResolvedValue(url),
    } as unknown as jest.Mocked<PoliceService>

    service = new PoliceDigitalCaseFileService(
      policeDigitalCaseFileRepositoryService,
      {} as CourtDocumentRepositoryService,
      {} as CaseFileRepositoryService,
      policeService,
      {} as AwsS3Service,
      {} as Sequelize,
      { debug: jest.fn(), error: jest.fn() } as unknown as Logger,
    )
  })

  it('gets a token url for a file that is synced to the case', async () => {
    policeDigitalCaseFileRepositoryService.findByCaseId.mockResolvedValueOnce([
      makeStoredPoliceDigitalCaseFile({ policeDigitalFileId: 'other-file' }),
      makeStoredPoliceDigitalCaseFile(),
    ] as never)

    const result = await service.getTokenUrl(
      caseId,
      user,
      policeDigitalFileId,
      caseNumbers,
    )

    expect(
      policeDigitalCaseFileRepositoryService.findByCaseId,
    ).toHaveBeenCalledWith(caseId)
    expect(policeService.getTokenUrl).toHaveBeenCalledWith(
      caseId,
      user.nationalId,
      policeDigitalFileId,
      user,
      'getPoliceDigitalCaseFileTokenUrl',
      caseNumbers,
    )
    expect(result).toBe(url)
  })

  it('does not ask for a token url for a file that is not synced to the case', async () => {
    policeDigitalCaseFileRepositoryService.findByCaseId.mockResolvedValueOnce([
      makeStoredPoliceDigitalCaseFile({ policeDigitalFileId: 'other-file' }),
    ] as never)

    await expect(
      service.getTokenUrl(caseId, user, policeDigitalFileId, caseNumbers),
    ).rejects.toThrow(NotFoundException)

    expect(policeService.getTokenUrl).not.toHaveBeenCalled()
  })

  it('does not ask for a token url for a file of a police case number that is no longer on the case', async () => {
    policeDigitalCaseFileRepositoryService.findByCaseId.mockResolvedValueOnce([
      makeStoredPoliceDigitalCaseFile({ policeCaseNumber: '007-2024-9999' }),
    ] as never)

    await expect(
      service.getTokenUrl(caseId, user, policeDigitalFileId, caseNumbers),
    ).rejects.toThrow(NotFoundException)

    expect(policeService.getTokenUrl).not.toHaveBeenCalled()
  })
})
