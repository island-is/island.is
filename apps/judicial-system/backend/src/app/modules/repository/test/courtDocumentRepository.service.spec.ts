import { Op, Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { CaseFileCategory } from '@island.is/judicial-system/types'

import { CaseFile } from '../models/caseFile.model'
import { CourtDocument } from '../models/courtDocument.model'
import { CourtSession } from '../models/courtSession.model'
import { CourtDocumentRepositoryService } from '../services/courtDocumentRepository.service'

describe('CourtDocumentRepositoryService', () => {
  const transaction = {
    LOCK: { UPDATE: 'UPDATE' },
  } as unknown as Transaction

  let service: CourtDocumentRepositoryService
  let courtDocumentModel: { findAll: jest.Mock; update: jest.Mock }
  let courtSessionModel: { findAll: jest.Mock }

  beforeEach(async () => {
    courtDocumentModel = {
      findAll: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue([1, []]),
    }

    // No existing court sessions, so the next document order resolves to 1
    // and no merged-document bookkeeping is triggered.
    courtSessionModel = {
      findAll: jest.fn().mockResolvedValue([]),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(CourtDocument), useValue: courtDocumentModel },
        { provide: getModelToken(CourtSession), useValue: courtSessionModel },
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
})
