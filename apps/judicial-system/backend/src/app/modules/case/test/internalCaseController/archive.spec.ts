import CryptoJS from 'crypto-js'
import { Op } from 'sequelize'
import { Transaction } from 'sequelize/types'
import { uuid } from 'uuidv4'

import { ConfigType } from '@island.is/nest/config'

import { CaseState, UserRole } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { uuidFactory } from '../../../../factories'
import { Defendant, DefendantService } from '../../../defendant'
import { CaseFile, FileService } from '../../../file'
import {
  IndictmentCount,
  IndictmentCountService,
} from '../../../indictment-count'
import { caseModuleConfig } from '../../case.config'
import { archiveFilter } from '../../filters/case.archiveFilter'
import { ArchiveResponse } from '../../models/archive.response'
import { Case } from '../../models/case.model'
import { CaseArchive } from '../../models/caseArchive.model'

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
  let mockIndictmentCountService: IndictmentCountService
  let mockCaseModel: typeof Case
  let mockCaseArchiveModel: typeof CaseArchive
  let mockCaseConfig: ConfigType<typeof caseModuleConfig>
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      fileService,
      defendantService,
      indictmentCountService,
      sequelize,
      caseModel,
      caseArchiveModel,
      caseConfig,
      internalCaseController,
    } = await createTestingCaseModule()

    mockFileService = fileService
    mockDefendantService = defendantService
    mockIndictmentCountService = indictmentCountService
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
          { model: IndictmentCount, as: 'indictmentCounts' },
          { model: CaseFile, as: 'caseFiles' },
        ],
        order: [
          [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
          [
            { model: IndictmentCount, as: 'indictmentCounts' },
            'created',
            'ASC',
          ],
          [{ model: CaseFile, as: 'caseFiles' }, 'created', 'ASC'],
        ],
        where: {
          isArchived: false,
          [Op.or]: [{ state: CaseState.DELETED }, archiveFilter],
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
    const indictmentCountId1 = uuid()
    const indictmentCountId2 = uuid()
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
      indictmentIntroduction: 'original_indictment_introduction',
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
      indictmentCounts: [
        {
          id: indictmentCountId1,
          vehicleRegistrationNumber: 'original_vehicle_registration_number1',
          incidentDescription: 'original_indictment_description1',
          legalArguments: 'original_legal_arguments1',
        },
        {
          id: indictmentCountId2,
          vehicleRegistrationNumber: 'original_vehicle_registration_number2',
          incidentDescription: 'original_indictment_description2',
          legalArguments: 'original_legal_arguments2',
        },
      ],
      appealConclusion: 'original_appeal_conclusion',
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
      indictmentIntroduction: 'original_indictment_introduction',
      appealConclusion: 'original_appeal_conclusion',
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
      indictmentCounts: [
        {
          vehicleRegistrationNumber: 'original_vehicle_registration_number1',
          incidentDescription: 'original_indictment_description1',
          legalArguments: 'original_legal_arguments1',
        },
        {
          vehicleRegistrationNumber: 'original_vehicle_registration_number2',
          incidentDescription: 'original_indictment_description2',
          legalArguments: 'original_legal_arguments2',
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
      expect(mockDefendantService.updateForArcive).toHaveBeenCalledWith(
        caseId,
        defendantId1,
        { nationalId: '', name: '', address: '' },
        transaction,
      )
    })

    it('should clear encrypted defendant two properties', () => {
      expect(mockDefendantService.updateForArcive).toHaveBeenCalledWith(
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

    it('should clear encrypted indictment count one properties', () => {
      expect(mockIndictmentCountService.update).toHaveBeenCalledWith(
        caseId,
        indictmentCountId1,
        {
          vehicleRegistrationNumber: '',
          incidentDescription: '',
          legalArguments: '',
        },
        transaction,
      )
    })

    it('should clear encrypted indictment count two properties', () => {
      expect(mockIndictmentCountService.update).toHaveBeenCalledWith(
        caseId,
        indictmentCountId2,
        {
          vehicleRegistrationNumber: '',
          incidentDescription: '',
          legalArguments: '',
        },
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
          crimeScenes: null,
          indictmentIntroduction: '',
          appealConclusion: '',
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
