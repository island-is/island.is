import CryptoJS from 'crypto-js'
import { uuid } from 'uuidv4'
import { literal, Op } from 'sequelize'
import { Transaction } from 'sequelize/types'

import { ConfigType } from '@island.is/nest/config'
import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { createTestingCaseModule } from './createTestingCaseModule'
import { Defendant, DefendantService } from '../../defendant'
import { CaseFile, FileService } from '../../file'
import { User } from '../../user'
import { Institution } from '../../institution'
import { ArchiveResponse } from '../models/archive.response'
import { Case } from '../models/case.model'
import { caseModuleConfig } from '../case.config'

jest.mock('crypto-js')
interface Then {
  result: ArchiveResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('CaseController - Archive', () => {
  let mockFileService: FileService
  let mockDefendantService: DefendantService
  let mockCaseModel: typeof Case
  let mockCaseConfig: ConfigType<typeof caseModuleConfig>
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      fileService,
      defendantService,
      sequelize,
      caseModel,
      caseConfig,
      caseController,
    } = await createTestingCaseModule()

    mockFileService = fileService
    mockDefendantService = defendantService
    mockCaseModel = caseModel
    mockCaseConfig = caseConfig

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async () => {
      const then = {} as Then

      await caseController
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
          { model: Institution, as: 'court' },
          {
            model: User,
            as: 'creatingProsecutor',
            include: [{ model: Institution, as: 'institution' }],
          },
          {
            model: User,
            as: 'prosecutor',
            include: [{ model: Institution, as: 'institution' }],
          },
          { model: Institution, as: 'sharedWithProsecutorsOffice' },
          {
            model: User,
            as: 'judge',
            include: [{ model: Institution, as: 'institution' }],
          },
          {
            model: User,
            as: 'registrar',
            include: [{ model: Institution, as: 'institution' }],
          },
          {
            model: User,
            as: 'courtRecordSignatory',
            include: [{ model: Institution, as: 'institution' }],
          },
          { model: Case, as: 'parentCase' },
          { model: Case, as: 'childCase' },
          { model: CaseFile, as: 'caseFiles' },
        ],
        order: [
          [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
          [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
        ],
        where: {
          isArchived: false,
          [Op.or]: [
            { state: CaseState.DELETED },
            {
              [Op.or]: [
                {
                  [Op.and]: [
                    { state: [CaseState.REJECTED, CaseState.DISMISSED] },
                    { ruling_date: { [Op.lt]: literal('current_date - 90') } },
                  ],
                },
                {
                  [Op.and]: [
                    {
                      state: [
                        CaseState.NEW,
                        CaseState.DRAFT,
                        CaseState.SUBMITTED,
                        CaseState.RECEIVED,
                      ],
                    },
                    { created: { [Op.lt]: literal('current_date - 90') } },
                  ],
                },
                {
                  [Op.and]: [
                    { type: [CaseType.CUSTODY, CaseType.TRAVEL_BAN] },
                    { state: CaseState.ACCEPTED },
                    {
                      valid_to_date: { [Op.lt]: literal('current_date - 90') },
                    },
                  ],
                },
                {
                  [Op.and]: [
                    {
                      [Op.not]: {
                        type: [CaseType.CUSTODY, CaseType.TRAVEL_BAN],
                      },
                    },
                    { state: CaseState.ACCEPTED },
                    { ruling_date: { [Op.lt]: literal('current_date - 90') } },
                  ],
                },
              ],
            },
          ],
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
      // courtDocuments: 'original_courtDocuments',
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
        { id: caseFileId1, name: 'original_name1', key: 'original_key1' },
        { id: caseFileId2, name: 'original_name2', key: 'original_key2' },
      ],
      isArchived: false,
    }
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockCaseModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(theCase)
      const mockUpdate = mockCaseModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])
      const mockEncrypt = CryptoJS.AES.encrypt as jest.Mock
      mockEncrypt.mockImplementation((value: string, key: string) => ({
        toString: () =>
          key === mockCaseConfig.archiveEncryptionKey
            ? value.replace('original', 'encrypted')
            : value,
      }))

      then = await givenWhenThen()
    })

    it('should update encrypted case properties', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        {
          description: 'encrypted_description',
          demands: 'encrypted_demands',
          lawsBroken: 'encrypted_lawsBroken',
          legalBasis: 'encrypted_legalBasis',
          requestedOtherRestrictions: 'encrypted_requestedOtherRestrictions',
          caseFacts: 'encrypted_caseFacts',
          legalArguments: 'encrypted_legalArguments',
          prosecutorOnlySessionRequest:
            'encrypted_prosecutorOnlySessionRequest',
          comments: 'encrypted_comments',
          caseFilesComments: 'encrypted_caseFilesComments',
          courtAttendees: 'encrypted_courtAttendees',
          prosecutorDemands: 'encrypted_prosecutorDemands',
          // courtDocuments: 'encrypted_courtDocuments',
          sessionBookings: 'encrypted_sessionBookings',
          courtCaseFacts: 'encrypted_courtCaseFacts',
          introduction: 'encrypted_introduction',
          courtLegalArguments: 'encrypted_courtLegalArguments',
          ruling: 'encrypted_ruling',
          conclusion: 'encrypted_conclusion',
          endOfSessionBookings: 'encrypted_endOfSessionBookings',
          accusedAppealAnnouncement: 'encrypted_accusedAppealAnnouncement',
          prosecutorAppealAnnouncement:
            'encrypted_prosecutorAppealAnnouncement',
          caseModifiedExplanation: 'encrypted_caseModifiedExplanation',
          caseResentExplanation: 'encrypted_caseResentExplanation',
          isArchived: true,
        },
        { where: { id: caseId }, transaction },
      )
    })

    it('should update encrypted defendant one properties', () => {
      expect(mockDefendantService.update).toHaveBeenCalledWith(
        caseId,
        defendantId1,
        {
          nationalId: 'encrypted_nationalId1',
          name: 'encrypted_name1',
          address: 'encrypted_address1',
        },
        transaction,
      )
    })

    it('should update encrypted defendant two properties', () => {
      expect(mockDefendantService.update).toHaveBeenCalledWith(
        caseId,
        defendantId2,
        {
          nationalId: 'encrypted_nationalId2',
          name: 'encrypted_name2',
          address: 'encrypted_address2',
        },
        transaction,
      )
    })

    it('should update encrypted case file one properties', () => {
      expect(mockFileService.updateCaseFile).toHaveBeenCalledWith(
        caseId,
        caseFileId1,
        {
          name: 'encrypted_name1',
          key: 'encrypted_key1',
        },
        transaction,
      )
    })

    it('should update encrypted case file two properties', () => {
      expect(mockFileService.updateCaseFile).toHaveBeenCalledWith(
        caseId,
        caseFileId2,
        {
          name: 'encrypted_name2',
          key: 'encrypted_key2',
        },
        transaction,
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
