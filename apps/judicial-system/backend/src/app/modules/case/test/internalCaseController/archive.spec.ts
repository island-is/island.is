import CryptoJS from 'crypto-js'
import { Transaction } from 'sequelize'
import { uuid } from 'uuidv4'

import { ConfigType } from '@island.is/nest/config'

import { UserRole } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { uuidFactory } from '../../../../factories'
import { DefendantService } from '../../../defendant'
import { FileService } from '../../../file'
import { IndictmentCountService } from '../../../indictment-count'
import {
  CaseArchive,
  CaseFile,
  CaseRepositoryService,
  CaseString,
  Defendant,
  IndictmentCount,
  Offense,
} from '../../../repository'
import { caseModuleConfig } from '../../case.config'
import { archiveFilter } from '../../filters/case.archiveFilter'
import { ArchiveResponse } from '../../models/archive.response'

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
  let mockCaseStringModel: typeof CaseString
  let mockCaseRepositoryService: CaseRepositoryService
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
      caseStringModel,
      caseRepositoryService,
      caseArchiveModel,
      caseConfig,
      internalCaseController,
    } = await createTestingCaseModule()

    mockFileService = fileService
    mockDefendantService = defendantService
    mockIndictmentCountService = indictmentCountService
    mockCaseStringModel = caseStringModel
    mockCaseRepositoryService = caseRepositoryService
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

  describe('case archived', () => {
    const caseId = uuid()
    const defendantId1 = uuid()
    const defendantId2 = uuid()
    const caseFileId1 = uuid()
    const caseFileId2 = uuid()
    const indictmentCountId1 = uuid()
    const indictmentCountId2 = uuid()
    const caseStringId1 = uuid()
    const caseStringId2 = uuid()
    const theCase = {
      id: caseId,
      description: 'original_description',
      demands: 'original_demands',
      lawsBroken: 'original_lawsBroken',
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
      appealRulingModifiedHistory: 'original_appeal_ruling_modified_history',
      indictmentDeniedExplanation: 'original_indictment_denied_explanation',
      indictmentReturnedExplanation: 'original_indictment_returned_explanation',
      isArchived: false,
      caseStrings: [
        { id: caseStringId1, value: 'original_comment1' },
        { id: caseStringId2, value: 'original_comment2' },
      ],
    }
    const archive = JSON.stringify({
      description: 'original_description',
      demands: 'original_demands',
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
      appealConclusion: 'original_appeal_conclusion',
      appealRulingModifiedHistory: 'original_appeal_ruling_modified_history',
      indictmentDeniedExplanation: 'original_indictment_denied_explanation',
      indictmentReturnedExplanation: 'original_indictment_returned_explanation',
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
      caseStrings: [
        { value: 'original_comment1' },
        { value: 'original_comment2' },
      ],
    })
    const iv = uuid()
    const parsedIv = 'parsed_iv'
    const encryptedCase = 'encrypted_case'
    let then: Then

    beforeEach(async () => {
      const mockUpdateCaseString = mockCaseStringModel.update as jest.Mock
      mockUpdateCaseString.mockResolvedValueOnce([1])
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)
      const mockUpdate = mockCaseRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(theCase)
      const mockUuidFactory = uuidFactory as jest.Mock
      mockUuidFactory.mockReturnValueOnce(iv)
      const mockParse = CryptoJS.enc.Hex.parse as jest.Mock
      mockParse.mockReturnValueOnce(parsedIv)
      const mockEncrypt = CryptoJS.AES.encrypt as jest.Mock
      mockEncrypt.mockReturnValueOnce(encryptedCase)

      then = await givenWhenThen()
    })

    it('should lookup a case', () => {
      expect(mockCaseRepositoryService.findOne).toHaveBeenCalledWith({
        include: [
          { model: Defendant, as: 'defendants' },
          {
            model: IndictmentCount,
            as: 'indictmentCounts',
            include: [
              {
                model: Offense,
                as: 'offenses',
              },
            ],
          },
          { model: CaseFile, as: 'caseFiles' },
          { model: CaseString, as: 'caseStrings' },
        ],
        order: [
          [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
          [
            { model: IndictmentCount, as: 'indictmentCounts' },
            'created',
            'ASC',
          ],
          [{ model: CaseFile, as: 'caseFiles' }, 'created', 'ASC'],
          [{ model: CaseString, as: 'caseStrings' }, 'created', 'ASC'],
        ],
        where: archiveFilter,
      })
      expect(mockDefendantService.updateDatabaseDefendant).toHaveBeenCalledWith(
        caseId,
        defendantId1,
        { nationalId: '', name: '', address: '' },
        transaction,
      )
      expect(mockDefendantService.updateDatabaseDefendant).toHaveBeenCalledWith(
        caseId,
        defendantId2,
        { nationalId: '', name: '', address: '' },
        transaction,
      )
      expect(mockFileService.updateCaseFile).toHaveBeenCalledWith(
        caseId,
        caseFileId1,
        { name: '', key: '', userGeneratedFilename: '' },
        transaction,
      )
      expect(mockFileService.updateCaseFile).toHaveBeenCalledWith(
        caseId,
        caseFileId2,
        { name: '', key: '', userGeneratedFilename: '' },
        transaction,
      )
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
      expect(mockCaseStringModel.update).toHaveBeenCalledWith(
        { value: '' },
        { where: { id: caseStringId1, caseId }, transaction },
      )
      expect(mockCaseStringModel.update).toHaveBeenCalledWith(
        { value: '' },
        { where: { id: caseStringId2, caseId }, transaction },
      )
      expect(CryptoJS.enc.Hex.parse).toHaveBeenCalledWith(iv)
      expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith(
        archive,
        mockCaseConfig.archiveEncryptionKey,
        { iv: parsedIv },
      )
      expect(mockCaseArchiveModel.create).toHaveBeenCalledWith(
        {
          caseId,
          archive: encryptedCase,
        },
        { transaction },
      )
      expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        {
          description: '',
          demands: '',
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
          appealRulingModifiedHistory: '',
          indictmentDeniedExplanation: '',
          indictmentReturnedExplanation: '',
          isArchived: true,
        },
        { transaction },
      )
      expect(then.result).toEqual({ caseArchived: true })
    })
  })

  describe('no case found', () => {
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(null)

      then = await givenWhenThen()
    })

    it('should not archive a case', () => {
      expect(then.result).toEqual({ caseArchived: false })
    })
  })
})
