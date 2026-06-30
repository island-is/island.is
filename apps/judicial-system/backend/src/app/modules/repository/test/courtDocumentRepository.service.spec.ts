import { Transaction } from 'sequelize'

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
  let caseFileModel: { findAll: jest.Mock }

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

    caseFileModel = {
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

    it('does not auto-file "Önnur gögn" (CASE_FILE) documents but files generated and party-category documents', async () => {
      courtDocumentModel.findAll.mockResolvedValueOnce([
        { id: 'doc-gen', created: 1, caseFileId: null },
        { id: 'doc-party', created: 2, caseFileId: 'cf-party' },
        { id: 'doc-other', created: 3, caseFileId: 'cf-other' },
      ])
      // Only the CASE_FILE-backed case file is returned by the exclusion lookup
      caseFileModel.findAll.mockResolvedValue([{ id: 'cf-other' }])

      await service.fileAllAvailableCourtDocumentsInCourtSession(
        'case-1',
        'session-1',
        { transaction },
      )

      // The exclusion lookup only considers candidates with a backing case file
      expect(caseFileModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: ['cf-party', 'cf-other'],
            category: CaseFileCategory.CASE_FILE,
          },
        }),
      )

      const filed = filedDocumentIds()
      expect(filed).toContain('doc-gen')
      expect(filed).toContain('doc-party')
      expect(filed).not.toContain('doc-other')
    })

    it('files nothing when every available document is an "Önnur gögn" (CASE_FILE) document', async () => {
      courtDocumentModel.findAll.mockResolvedValueOnce([
        { id: 'doc-other', created: 1, caseFileId: 'cf-other' },
      ])
      caseFileModel.findAll.mockResolvedValue([{ id: 'cf-other' }])

      await service.fileAllAvailableCourtDocumentsInCourtSession(
        'case-1',
        'session-1',
        { transaction },
      )

      // Early return after filtering: no document is filed
      expect(courtDocumentModel.update).not.toHaveBeenCalled()
    })

    it('skips the case file lookup and files nothing when there are no available documents', async () => {
      courtDocumentModel.findAll.mockResolvedValueOnce([])

      await service.fileAllAvailableCourtDocumentsInCourtSession(
        'case-1',
        'session-1',
        { transaction },
      )

      expect(caseFileModel.findAll).not.toHaveBeenCalled()
      expect(courtDocumentModel.update).not.toHaveBeenCalled()
    })
  })
})
