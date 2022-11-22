import CryptoJS from 'crypto-js'
import { uuid } from 'uuidv4'
import { Op } from 'sequelize'
import { Transaction } from 'sequelize/types'

import { ConfigType } from '@island.is/nest/config'
import {
  CaseFileState,
  CaseState,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'
import { uuidFactory } from '../../../../factories'
import { Defendant, DefendantService } from '../../../defendant'
import { CaseFile, FileService } from '../../../file'
import { ArchiveResponse } from '../../models/archive.response'
import { Case } from '../../models/case.model'
import { CaseArchive } from '../../models/caseArchive.model'
import { caseModuleConfig } from '../../case.config'
import { oldFilter } from '../../filters/case.filters'

jest.mock('crypto-js')
jest.mock('../../../../factories')

interface Then {
  result: ArchiveResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('InternalCaseController - Archive', () => {
  let mockFileService: FileService
  let mockDefendantService: DefendantService
  let mockCaseModel: typeof Case
  let mockCaseArchiveModel: typeof CaseArchive
  let mockCaseConfig: ConfigType<typeof caseModuleConfig>
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      fileService,
      defendantService,
      sequelize,
      caseModel,
      caseArchiveModel,
      caseConfig,
      internalCaseController,
    } = await createTestingCaseModule()

    mockFileService = fileService
    mockDefendantService = defendantService
    mockCaseModel = caseModel
    mockCaseArchiveModel = caseArchiveModel
    mockCaseConfig = caseConfig

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async () => {
      const then = {} as Then

      await internalCaseController
        .archive()
        .then((res) => (then.result = res))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('case lookup', () => {
    beforeEach(async () => {
      await givenWhenThen()
    })

    it('should lookup a case', () => {
      expect(mockCaseModel.findOne).toHaveBeenCalledWith({
        include: [
          { model: Defendant, as: 'defendants' },
          {
            model: CaseFile,
            as: 'caseFiles',
            required: false,
            where: {
              state: { [Op.not]: CaseFileState.DELETED },
            },
          },
        ],
        order: [
          [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
          [{ model: CaseFile, as: 'caseFiles' }, 'created', 'ASC'],
        ],
        where: {
          isArchived: false,
          [Op.or]: [{ state: CaseState.DELETED }, oldFilter],
        },
      })
    })
  })

  describe('encrypt case', () => {
    const caseId = uuid()
    const defendantId1 = uuid()
    const defendantId2 = uuid()
    const caseFileId1 = uuid()
    const caseFileId2 = uuid()
    const theCase = {
      id: caseId,
      description: 'original_description',
      demands: 'original_demands',
      lawsBroken: 'original_lawsBroken',
      legalBasis: 'original_legalBasis',
      requestedOtherRestrictions: 'original_requestedOtherRestrictions',
      caseFacts: 'original_caseFacts',
      legalArguments: 'original_legalArguments',
      prosecutorOnlySessionRequest: 'original_prosecutorOnlySessionRequest',
      comments: 'original_comments',
      caseFilesComments: 'original_caseFilesComments',
      courtAttendees: 'original_courtAttendees',
      prosecutorDemands: 'original_prosecutorDemands',
      courtDocuments: [
        { name: 'original_courtDocument1', submittedBy: UserRole.PROSECUTOR },
        { name: 'original_courtDocument2', submittedBy: UserRole.DEFENDER },
      ],
      sessionBookings: 'original_sessionBookings',
      courtCaseFacts: 'original_courtCaseFacts',
      introduction: 'original_introduction',
      courtLegalArguments: 'original_courtLegalArguments',
      ruling: 'original_ruling',
      conclusion: 'original_conclusion',
      endOfSessionBookings: 'original_endOfSessionBookings',
      accusedAppealAnnouncement: 'original_accusedAppealAnnouncement',
      prosecutorAppealAnnouncement: 'original_prosecutorAppealAnnouncement',
      caseModifiedExplanation: 'original_caseModifiedExplanation',
      caseResentExplanation: 'original_caseResentExplanation',
      defendants: [
        {
          id: defendantId1,
          nationalId: 'original_nationalId1',
          name: 'original_name1',
          address: 'original_address1',
        },
        {
          id: defendantId2,
          nationalId: 'original_nationalId2',
          name: 'original_name2',
          address: 'original_address2',
        },
      ],
      caseFiles: [
        {
          id: caseFileId1,
          name: 'original_name1',
          key: 'original_key1',
          userGeneratedFilename: 'original_user_generated_filename1',
        },
        {
          id: caseFileId2,
          name: 'original_name2',
          key: 'original_key2',
          userGeneratedFilename: 'original_user_generated_filename2',
        },
      ],
      isArchived: false,
    }
    const archive = JSON.stringify({
      description: 'original_description',
      demands: 'original_demands',
      lawsBroken: 'original_lawsBroken',
      legalBasis: 'original_legalBasis',
      requestedOtherRestrictions: 'original_requestedOtherRestrictions',
      caseFacts: 'original_caseFacts',
      legalArguments: 'original_legalArguments',
      prosecutorOnlySessionRequest: 'original_prosecutorOnlySessionRequest',
      comments: 'original_comments',
      caseFilesComments: 'original_caseFilesComments',
      courtAttendees: 'original_courtAttendees',
      prosecutorDemands: 'original_prosecutorDemands',
      courtDocuments: [
        {
          name: 'original_courtDocument1',
          submittedBy: UserRole.PROSECUTOR,
        },
        { name: 'original_courtDocument2', submittedBy: UserRole.DEFENDER },
      ],
      sessionBookings: 'original_sessionBookings',
      courtCaseFacts: 'original_courtCaseFacts',
      introduction: 'original_introduction',
      courtLegalArguments: 'original_courtLegalArguments',
      ruling: 'original_ruling',
      conclusion: 'original_conclusion',
      endOfSessionBookings: 'original_endOfSessionBookings',
      accusedAppealAnnouncement: 'original_accusedAppealAnnouncement',
      prosecutorAppealAnnouncement: 'original_prosecutorAppealAnnouncement',
      caseModifiedExplanation: 'original_caseModifiedExplanation',
      caseResentExplanation: 'original_caseResentExplanation',
      defendants: [
        {
          nationalId: 'original_nationalId1',
          name: 'original_name1',
          address: 'original_address1',
        },
        {
          nationalId: 'original_nationalId2',
          name: 'original_name2',
          address: 'original_address2',
        },
      ],
      caseFiles: [
        {
          name: 'original_name1',
          key: 'original_key1',
          userGeneratedFilename: 'original_user_generated_filename1',
        },
        {
          name: 'original_name2',
          key: 'original_key2',
          userGeneratedFilename: 'original_user_generated_filename2',
        },
      ],
    })
    const iv = uuid()
    const parsedIv = 'parsed_iv'
    const encryptedCase = 'encrypted_case'
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])
      const mockUuidFactory = uuidFactory as jest.Mock
      mockUuidFactory.mockReturnValueOnce(iv)
      const mockParse = CryptoJS.enc.Hex.parse as jest.Mock
      mockParse.mockReturnValueOnce(parsedIv)
      const mockEncrypt = CryptoJS.AES.encrypt as jest.Mock
      mockEncrypt.mockReturnValueOnce(encryptedCase)

      then = await givenWhenThen()
    })

    it('should clear encrypted defendant one properties', () => {
      expect(mockDefendantService.update).toHaveBeenCalledWith(
        caseId,
        defendantId1,
        { nationalId: '', name: '', address: '' },
        transaction,
      )
    })

    it('should clear encrypted defendant two properties', () => {
      expect(mockDefendantService.update).toHaveBeenCalledWith(
        caseId,
        defendantId2,
        { nationalId: '', name: '', address: '' },
        transaction,
      )
    })

    it('should clear encrypted case file one properties', () => {
      expect(mockFileService.updateCaseFile).toHaveBeenCalledWith(
        caseId,
        caseFileId1,
        { name: '', key: '', userGeneratedFilename: '' },
        transaction,
      )
    })

    it('should clear encrypted case file two properties', () => {
      expect(mockFileService.updateCaseFile).toHaveBeenCalledWith(
        caseId,
        caseFileId2,
        { name: '', key: '', userGeneratedFilename: '' },
        transaction,
      )
    })

    it('should parse the iv', () => {
      expect(CryptoJS.enc.Hex.parse).toHaveBeenCalledWith(iv)
    })

    it('should encrypt properties', () => {
      expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith(
        archive,
        mockCaseConfig.archiveEncryptionKey,
        { iv: parsedIv },
      )
    })

    it('should create an archive', () => {
      expect(mockCaseArchiveModel.create).toHaveBeenCalledWith(
        {
          caseId,
          archive: encryptedCase,
        },
        { transaction },
      )
    })

    it('should clear encrypted case properties', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        {
          description: '',
          demands: '',
          lawsBroken: '',
          legalBasis: '',
          requestedOtherRestrictions: '',
          caseFacts: '',
          legalArguments: '',
          prosecutorOnlySessionRequest: '',
          comments: '',
          caseFilesComments: '',
          courtAttendees: '',
          prosecutorDemands: '',
          courtDocuments: null,
          sessionBookings: '',
          courtCaseFacts: '',
          introduction: '',
          courtLegalArguments: '',
          ruling: '',
          conclusion: '',
          endOfSessionBookings: '',
          accusedAppealAnnouncement: '',
          prosecutorAppealAnnouncement: '',
          caseModifiedExplanation: '',
          caseResentExplanation: '',
          isArchived: true,
        },
        { where: { id: caseId }, transaction },
      )
    })

    it('should succeed', () => {
      expect(then.result).toEqual({ caseArchived: true })
    })
  })

  describe('no case found', () => {
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(null)

      then = await givenWhenThen()
    })

    it('should not archive a case', () => {
      expect(then.result).toEqual({ caseArchived: false })
    })
  })
})
