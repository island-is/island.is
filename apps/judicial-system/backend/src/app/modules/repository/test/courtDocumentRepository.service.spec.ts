import { Op, Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseFileCategory,
  CourtDocumentType,
} from '@island.is/judicial-system/types'

import { CaseFile } from '../models/caseFile.model'
import { CourtDocument } from '../models/courtDocument.model'
import { CourtSession } from '../models/courtSession.model'
import { CourtDocumentRepositoryService } from '../services/courtDocumentRepository.service'

describe('CourtDocumentRepositoryService', () => {
  const transaction = {
    LOCK: { UPDATE: 'UPDATE' },
  } as unknown as Transaction

  let service: CourtDocumentRepositoryService
  let courtDocumentModel: {
    findAll: jest.Mock
    update: jest.Mock
    create: jest.Mock
  }
  let courtSessionModel: { findAll: jest.Mock; findOne: jest.Mock }
  let caseFileModel: { findByPk: jest.Mock }

  beforeEach(async () => {
    courtDocumentModel = {
      findAll: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue([1, []]),
      create: jest.fn().mockImplementation((values) =>
        Promise.resolve({ id: 'new-doc', ...values }),
      ),
    }

    // No existing court sessions, so the next document order resolves to 1
    // and no merged-document bookkeeping is triggered.
    courtSessionModel = {
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
    }

    caseFileModel = {
      findByPk: jest.fn().mockResolvedValue(null),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(CourtDocument), useValue: courtDocumentModel },
        { provide: getModelToken(CourtSession), useValue: courtSessionModel },
        { provide: getModelToken(CaseFile), useValue: caseFileModel },
        CourtDocumentRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(CourtDocumentRepositoryService)
  })

  describe('fileAllAvailableCourtDocumentsInCourtSession', () => {
    // Returns the ids of the documents that were actually filed into the
    // court session (i.e. updated with a courtSessionId).
    const filedDocumentIds = () =>
      courtDocumentModel.update.mock.calls
        .filter(([values]) => values.courtSessionId !== undefined)
        .map(([, options]) => options.where.id)

    it('excludes "Önnur gögn" (CASE_FILE) documents in the query and files the returned documents', async () => {
      // The DB query already excludes CASE_FILE-backed documents, so it only
      // returns the generated and party-category documents.
      courtDocumentModel.findAll.mockResolvedValueOnce([
        { id: 'doc-gen', created: 1 },
        { id: 'doc-party', created: 2 },
      ])

      await service.fileAllAvailableCourtDocumentsInCourtSession(
        'case-1',
        'session-1',
        { transaction },
      )

      // The unfiled-documents query filters out CASE_FILE case files via a
      // left join on the backing case file.
      const [queryArg] = courtDocumentModel.findAll.mock.calls[0]
      expect(queryArg.where).toEqual(
        expect.objectContaining({
          caseId: 'case-1',
          courtSessionId: null,
          documentOrder: 0,
          [Op.or]: [
            { caseFileId: null },
            { '$caseFile.category$': { [Op.ne]: CaseFileCategory.CASE_FILE } },
          ],
        }),
      )
      expect(queryArg.include).toEqual([
        expect.objectContaining({
          model: CaseFile,
          as: 'caseFile',
          required: false,
        }),
      ])

      const filed = filedDocumentIds()
      expect(filed).toContain('doc-gen')
      expect(filed).toContain('doc-party')
    })

    it('files nothing when the query returns no available documents', async () => {
      courtDocumentModel.findAll.mockResolvedValueOnce([])

      await service.fileAllAvailableCourtDocumentsInCourtSession(
        'case-1',
        'session-1',
        { transaction },
      )

      expect(courtDocumentModel.update).not.toHaveBeenCalled()
    })
  })

  describe('create', () => {
    const unconfirmedSession = { id: 'session-1', isConfirmed: false }

    it('does not file an "Önnur gögn" (CASE_FILE) document into an open court session', async () => {
      courtSessionModel.findOne.mockResolvedValue(unconfirmedSession)
      caseFileModel.findByPk.mockResolvedValue({
        category: CaseFileCategory.CASE_FILE,
      })

      await service.create(
        'case-1',
        {
          documentType: CourtDocumentType.UPLOADED_DOCUMENT,
          name: 'Önnur gögn',
          caseFileId: 'cf-other',
        },
        { transaction },
      )

      expect(courtDocumentModel.create).toHaveBeenCalledTimes(1)
      const [values] = courtDocumentModel.create.mock.calls[0]
      expect(values.courtSessionId).toBeUndefined()
      expect(values.documentOrder).toBe(0)
    })

    it('files a party-category document into an open court session', async () => {
      courtSessionModel.findOne.mockResolvedValue(unconfirmedSession)
      caseFileModel.findByPk.mockResolvedValue({
        category: CaseFileCategory.PROSECUTOR_CASE_FILE,
      })

      await service.create(
        'case-1',
        {
          documentType: CourtDocumentType.UPLOADED_DOCUMENT,
          name: 'Sakskjal',
          caseFileId: 'cf-party',
        },
        { transaction },
      )

      expect(courtDocumentModel.create).toHaveBeenCalledTimes(1)
      const [values] = courtDocumentModel.create.mock.calls[0]
      expect(values.courtSessionId).toBe('session-1')
    })
  })
})
