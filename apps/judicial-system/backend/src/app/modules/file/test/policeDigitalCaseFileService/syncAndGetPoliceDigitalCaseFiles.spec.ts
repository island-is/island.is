import { Sequelize } from 'sequelize-typescript'

import type { Logger } from '@island.is/logging'

import {
  CaseState,
  CaseType,
  type User,
} from '@island.is/judicial-system/types'

import { AwsS3Service } from '../../../aws-s3'
import { PoliceService } from '../../../police/police.service'
import {
  CaseFile,
  PoliceDigitalCaseFileRepositoryService,
} from '../../../repository'
import { PoliceDigitalCaseFileService } from '../../policeDigitalCaseFiles/policeDigitalCaseFile.service'

const caseId = 'case-1'
const policeCaseNumber = '007-2024-1234'
const policeDigitalFileId = 'digital-file-1'

const makePoliceSystemDigitalCaseFile = () => ({
  id: policeDigitalFileId,
  policeCaseNumber,
  policeExternalVendorId: 'vendor-1',
  name: 'digital-file-name',
  displayDate: new Date('2026-05-07T00:00:00.000Z'),
})

const makeStoredPoliceDigitalCaseFile = () => ({
  id: 'stored-1',
  caseId,
  policeCaseNumber,
  policeDigitalFileId,
  policeExternalVendorId: 'vendor-1',
  name: 'digital-file-name',
  displayDate: new Date('2026-05-07T00:00:00.000Z'),
})

describe('PoliceDigitalCaseFileService - syncAndGetPoliceDigitalCaseFiles', () => {
  let policeDigitalCaseFileRepositoryService: jest.Mocked<PoliceDigitalCaseFileRepositoryService>
  let policeService: jest.Mocked<PoliceService>
  let awsS3Service: jest.Mocked<AwsS3Service>
  let caseFileModel: {
    findOne: jest.Mock
    create: jest.Mock
  }
  let sequelize: jest.Mocked<Sequelize>
  let logger: Logger
  let service: PoliceDigitalCaseFileService

  beforeEach(() => {
    policeDigitalCaseFileRepositoryService = {
      findAll: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<PoliceDigitalCaseFileRepositoryService>

    policeService = {
      getAllPoliceSystemDigitalCaseFiles: jest.fn(),
    } as unknown as jest.Mocked<PoliceService>

    awsS3Service = {
      putObject: jest.fn(),
    } as unknown as jest.Mocked<AwsS3Service>

    caseFileModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    }

    sequelize = {
      transaction: jest.fn(),
    } as unknown as jest.Mocked<Sequelize>

    logger = {
      debug: jest.fn(),
      error: jest.fn(),
    } as unknown as Logger

    service = new PoliceDigitalCaseFileService(
      policeDigitalCaseFileRepositoryService,
      policeService,
      awsS3Service,
      caseFileModel as unknown as typeof CaseFile,
      sequelize,
      logger,
    )
    ;(sequelize.transaction as jest.Mock).mockImplementation(
      async (callback: (transaction: unknown) => Promise<void>) =>
        callback({} as unknown),
    )
  })

  it('does not create metadata case files before court connection', async () => {
    policeService.getAllPoliceSystemDigitalCaseFiles.mockResolvedValueOnce([
      makePoliceSystemDigitalCaseFile() as never,
    ])
    policeDigitalCaseFileRepositoryService.findAll
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([makeStoredPoliceDigitalCaseFile() as never])

    policeDigitalCaseFileRepositoryService.create.mockResolvedValueOnce(
      makeStoredPoliceDigitalCaseFile() as never,
    )

    await service.syncAndGetPoliceDigitalCaseFiles(
      caseId,
      CaseType.INDICTMENT,
      CaseState.DRAFT,
      undefined,
      [policeCaseNumber],
      { nationalId: '0000000000' } as User,
    )

    expect(policeDigitalCaseFileRepositoryService.create).toHaveBeenCalledTimes(
      1,
    )
    expect(caseFileModel.findOne).not.toHaveBeenCalled()
    expect(caseFileModel.create).not.toHaveBeenCalled()
    expect(awsS3Service.putObject).not.toHaveBeenCalled()
  })

  it('creates metadata case files after court connection and submission', async () => {
    policeService.getAllPoliceSystemDigitalCaseFiles.mockResolvedValueOnce([
      makePoliceSystemDigitalCaseFile() as never,
    ])
    policeDigitalCaseFileRepositoryService.findAll
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([makeStoredPoliceDigitalCaseFile() as never])

    policeDigitalCaseFileRepositoryService.create.mockResolvedValueOnce(
      makeStoredPoliceDigitalCaseFile() as never,
    )
    caseFileModel.findOne.mockResolvedValueOnce(null)
    caseFileModel.create.mockResolvedValueOnce({ id: 'metadata-file-1' })
    awsS3Service.putObject.mockResolvedValueOnce('ok')

    await service.syncAndGetPoliceDigitalCaseFiles(
      caseId,
      CaseType.INDICTMENT,
      CaseState.SUBMITTED,
      'R-2026-1234',
      [policeCaseNumber],
      { nationalId: '0000000000' } as User,
    )

    expect(policeDigitalCaseFileRepositoryService.create).toHaveBeenCalledTimes(
      1,
    )
    expect(caseFileModel.findOne).toHaveBeenCalledTimes(1)
    expect(caseFileModel.create).toHaveBeenCalledTimes(1)
    expect(awsS3Service.putObject).toHaveBeenCalledTimes(1)
  })
})
