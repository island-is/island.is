import { Op, Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'
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
    findOne: jest.Mock
    count: jest.Mock
    create: jest.Mock
    bulkCreate: jest.Mock
    update: jest.Mock
    destroy: jest.Mock
  }
  let courtSessionModel: {
    findAll: jest.Mock
    findOne: jest.Mock
    count: jest.Mock
  }

  beforeEach(async () => {
    courtDocumentModel = {
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockResolvedValue({}),
      bulkCreate: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue([1, []]),
      destroy: jest.fn().mockResolvedValue(1),
    }

    // No existing court sessions, so the next document order resolves to 1
    // and no merged-document bookkeeping is triggered.
    courtSessionModel = {
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue({ id: 'session-1' }),
      count: jest.fn().mockResolvedValue(0),
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
    // court session (i.e. updated with a courtSessionId), in the order they
    // were given.
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
      // left join on the backing case file. documentOrder 0 is the available
      // pool, which leaves the documents the court removed (-1) out of it.
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

    // A deleted court session leaves every document it held unfiled and
    // without an order, so the next session has to put the merged cases back
    // together from nothing but the copies' timestamps.
    it('files the case own documents first, then each merged case as a block', async () => {
      const older = uuid()
      const newer = uuid()

      courtDocumentModel.findAll.mockResolvedValueOnce([
        { id: 'older-1', created: new Date(1), mergedFromCaseId: older },
        { id: 'own-1', created: new Date(2) },
        { id: 'newer-1', created: new Date(3), mergedFromCaseId: newer },
        { id: 'older-2', created: new Date(4), mergedFromCaseId: older },
        { id: 'own-2', created: new Date(5) },
        { id: 'newer-2', created: new Date(6), mergedFromCaseId: newer },
      ])

      await service.fileAllAvailableCourtDocumentsInCourtSession(
        'case-1',
        'session-1',
        { transaction },
      )

      expect(filedDocumentIds()).toEqual([
        'own-1',
        'own-2',
        'older-1',
        'older-2',
        'newer-1',
        'newer-2',
      ])
    })
  })

  describe('copyMergedCaseCourtDocumentsIntoCourtSession', () => {
    const parentCaseId = uuid()
    const parentCaseCourtSessionId = uuid()
    const mergedCaseId = uuid()

    const copy = () =>
      service.copyMergedCaseCourtDocumentsIntoCourtSession({
        parentCaseId,
        parentCaseCourtSessionId,
        mergedCaseId,
        transaction,
      })

    // The documents of the merged case the copies are made from - the query
    // that asks for them is the one scoped to the merged case, told apart from
    // the row locks the method takes on the parent's own documents.
    const sourceQuery = () =>
      courtDocumentModel.findAll.mock.calls
        .map(([options]) => options)
        .find((options) => options.where?.caseId === mergedCaseId)

    // The source documents are returned by that query alone; every other
    // findAll in this method locks the parent's rows and returns nothing.
    const givenSourceDocuments = (documents: unknown[]) =>
      courtDocumentModel.findAll.mockImplementation(
        async ({ where }: { where?: { caseId?: string } }) =>
          where?.caseId === mergedCaseId ? documents : [],
      )

    it('copies the filed documents of a merged case that held court sessions', async () => {
      courtSessionModel.count.mockResolvedValueOnce(2)
      const caseFileId = uuid()
      givenSourceDocuments([
        {
          id: 'source-1',
          documentType: CourtDocumentType.UPLOADED_DOCUMENT,
          name: 'Ákæra',
          caseFileId,
          generatedPdfUri: undefined,
          submittedBy: 'Saksóknari|PROSECUTOR_CASE_FILE',
        },
        {
          id: 'source-2',
          documentType: CourtDocumentType.EXTERNAL_DOCUMENT,
          name: 'Reikningur',
          caseFileId: undefined,
          generatedPdfUri: 's3://pdf',
          submittedBy: undefined,
        },
      ])

      const copied = await copy()

      expect(copied).toBe(true)
      // Only the documents the merged case actually laid before its own court
      expect(sourceQuery()?.where).toEqual({
        caseId: mergedCaseId,
        mergedFromCaseId: null,
        courtSessionId: { [Op.ne]: null },
        documentOrder: { [Op.gt]: 0 },
      })
      // New rows owned by the parent, as one block at the end of the session
      expect(courtDocumentModel.bulkCreate).toHaveBeenCalledWith(
        [
          {
            caseId: parentCaseId,
            courtSessionId: parentCaseCourtSessionId,
            documentOrder: 1,
            mergedFromCaseId: mergedCaseId,
            created: expect.any(Date),
            documentType: CourtDocumentType.UPLOADED_DOCUMENT,
            name: 'Ákæra',
            caseFileId,
            generatedPdfUri: undefined,
            submittedBy: 'Saksóknari|PROSECUTOR_CASE_FILE',
          },
          {
            caseId: parentCaseId,
            courtSessionId: parentCaseCourtSessionId,
            documentOrder: 2,
            mergedFromCaseId: mergedCaseId,
            created: expect.any(Date),
            documentType: CourtDocumentType.EXTERNAL_DOCUMENT,
            name: 'Reikningur',
            caseFileId: undefined,
            generatedPdfUri: 's3://pdf',
            submittedBy: undefined,
          },
        ],
        { transaction },
      )
    })

    it('copies every document of a merged case that never held a court session', async () => {
      courtSessionModel.count.mockResolvedValueOnce(0)
      givenSourceDocuments([{ id: 'source-1', name: 'Ákæra' }])

      await copy()

      expect(sourceQuery()?.where).toEqual({
        caseId: mergedCaseId,
        mergedFromCaseId: null,
      })
    })

    // Copying happens once. However the parent has since rearranged, renamed
    // or removed the copies, a new court session must not bring in a second
    // set of them.
    it('copies nothing when the merged case is already in the parent case', async () => {
      courtDocumentModel.count.mockResolvedValueOnce(3)

      const copied = await copy()

      expect(copied).toBe(false)
      expect(courtDocumentModel.count).toHaveBeenCalledWith({
        where: { caseId: parentCaseId, mergedFromCaseId: mergedCaseId },
        transaction,
      })
      expect(courtDocumentModel.bulkCreate).not.toHaveBeenCalled()
    })

    // Deleting a court session takes the order off every document it held, so
    // `created` is all that puts a block back in sequence afterwards - and a
    // whole block stamped at one instant has no sequence to put back.
    it('stamps the copies in source order so the block can be rebuilt', async () => {
      givenSourceDocuments([
        { id: 'source-1', name: 'Fyrirkall a' },
        { id: 'source-2', name: 'Fyrirkall b' },
        { id: 'source-3', name: 'Fyrirkall c' },
      ])

      await copy()

      const [copies] = courtDocumentModel.bulkCreate.mock.calls[0]
      const created = copies.map((c: { created: Date }) => c.created.getTime())

      expect(new Set(created).size).toBe(3)
      expect(created).toEqual([...created].sort((a, b) => a - b))
    })

    // A parent with no court documents of its own has no rows to lock, so the
    // question "is this merged case already here?" has to be asked behind a
    // lock on something that always exists - the court session being copied
    // into. Without it two requests merging the same case both answer no.
    it('locks the court session before asking whether the merge is already there', async () => {
      await copy()

      expect(courtSessionModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: parentCaseCourtSessionId, caseId: parentCaseId },
          lock: transaction.LOCK.UPDATE,
        }),
      )
      expect(
        courtSessionModel.findOne.mock.invocationCallOrder[0],
      ).toBeLessThan(courtDocumentModel.count.mock.invocationCallOrder[0])
    })

    it('copies nothing when the court session is not the parent case own', async () => {
      courtSessionModel.findOne.mockResolvedValueOnce(null)

      await expect(copy()).rejects.toThrow(
        `Could not find court session ${parentCaseCourtSessionId} of case ${parentCaseId}`,
      )
      expect(courtDocumentModel.bulkCreate).not.toHaveBeenCalled()
    })

    it('copies nothing when the merged case has no documents', async () => {
      givenSourceDocuments([])

      const copied = await copy()

      expect(copied).toBe(false)
      expect(courtDocumentModel.bulkCreate).not.toHaveBeenCalled()
    })
  })

  describe('findMergedCaseIdsFiledInCourtSession', () => {
    it('names each merged case once, in the order its block appears', async () => {
      const first = uuid()
      const second = uuid()

      courtDocumentModel.findAll.mockResolvedValueOnce([
        { mergedFromCaseId: first, documentOrder: 3 },
        { mergedFromCaseId: first, documentOrder: 4 },
        { mergedFromCaseId: second, documentOrder: 5 },
      ])

      const mergedCaseIds = await service.findMergedCaseIdsFiledInCourtSession(
        'case-1',
        'session-1',
        { transaction },
      )

      expect(mergedCaseIds).toEqual([first, second])
    })
  })

  describe('update - keeping a merged case together', () => {
    const caseId = uuid()
    const courtSessionId = uuid()
    const mergedCaseId = uuid()
    const otherMergedCaseId = uuid()

    // A session holding an own document, then a block of two copies, then a
    // block of one from another merged case.
    const own = { id: 'own-1', documentOrder: 1 }
    const merged1 = {
      id: 'merged-1',
      documentOrder: 2,
      mergedFromCaseId: mergedCaseId,
    }
    const merged2 = {
      id: 'merged-2',
      documentOrder: 3,
      mergedFromCaseId: mergedCaseId,
    }
    const other = {
      id: 'other-1',
      documentOrder: 4,
      mergedFromCaseId: otherMergedCaseId,
    }

    beforeEach(() => {
      courtDocumentModel.findAll.mockResolvedValue([
        own,
        merged1,
        merged2,
        other,
      ])
    })

    const reorder = (courtDocumentId: string, documentOrder: number) =>
      service.update(
        caseId,
        courtSessionId,
        courtDocumentId,
        { documentOrder },
        {
          transaction,
        },
      )

    it('allows a copy to move within its own block', async () => {
      await reorder('merged-2', 2)

      expect(courtDocumentModel.update).toHaveBeenCalled()
    })

    it('refuses to move a copy out of its block', async () => {
      await expect(reorder('merged-1', 4)).rejects.toThrow(BadRequestException)
      await expect(reorder('merged-1', 4)).rejects.toThrow(
        `The court documents of merged case ${mergedCaseId} must stay together in case ${caseId}`,
      )
    })

    it('refuses to move one of the case own documents into a block', async () => {
      await expect(reorder('own-1', 2)).rejects.toThrow(
        `The court documents of merged case ${mergedCaseId} must stay together in case ${caseId}`,
      )
    })

    it('allows one of the case own documents to move between two blocks', async () => {
      await reorder('own-1', 3)

      expect(courtDocumentModel.update).toHaveBeenCalled()
    })

    it('allows one of the case own documents to move past the blocks', async () => {
      await reorder('own-1', 4)

      expect(courtDocumentModel.update).toHaveBeenCalled()
    })
  })

  describe('fileInCourtSession - re-filing a copy', () => {
    const caseId = uuid()
    const courtSessionId = uuid()
    const otherCourtSessionId = uuid()
    const mergedCaseId = uuid()

    const block = [
      {
        id: 'merged-1',
        documentOrder: 4,
        courtSessionId,
        mergedFromCaseId: mergedCaseId,
      },
      {
        id: 'merged-2',
        documentOrder: 5,
        courtSessionId,
        mergedFromCaseId: mergedCaseId,
      },
    ]

    // The order the document was filed at, taken from the write that filed it
    const filedAtOrder = () =>
      courtDocumentModel.update.mock.calls.find(
        ([values]) => values.courtSessionId === courtSessionId,
      )?.[0].documentOrder

    // The block sits in the middle of the session, so the end of the block and
    // the end of the session are two different places.
    it('files a removed copy back at the end of its own block', async () => {
      courtDocumentModel.findOne.mockResolvedValueOnce({
        id: 'merged-3',
        mergedFromCaseId: mergedCaseId,
      })
      courtSessionModel.findAll.mockResolvedValueOnce([
        {
          id: courtSessionId,
          filedDocuments: [
            { id: 'own-1', documentOrder: 3 },
            ...block,
            { id: 'own-2', documentOrder: 6 },
          ],
        },
        { id: 'later-session', filedDocuments: [] },
      ])

      await service.fileInCourtSession(caseId, courtSessionId, 'merged-3', {
        transaction,
      })

      expect(filedAtOrder()).toBe(6)
    })

    it('refuses to file a copy into a session that does not hold its block', async () => {
      courtDocumentModel.findOne.mockResolvedValueOnce({
        id: 'merged-3',
        mergedFromCaseId: mergedCaseId,
      })
      courtSessionModel.findAll.mockResolvedValueOnce([
        {
          id: otherCourtSessionId,
          filedDocuments: block.map((d) => ({
            ...d,
            courtSessionId: otherCourtSessionId,
          })),
        },
        { id: courtSessionId, filedDocuments: [] },
      ])

      await expect(
        service.fileInCourtSession(caseId, courtSessionId, 'merged-3', {
          transaction,
        }),
      ).rejects.toThrow(
        `Court documents of merged case ${mergedCaseId} are filed in court session ${otherCourtSessionId} of case ${caseId}`,
      )
    })

    it('files one of the case own documents at the end of the session', async () => {
      courtDocumentModel.findOne.mockResolvedValueOnce({ id: 'own-3' })
      courtSessionModel.findAll.mockResolvedValueOnce([
        {
          id: courtSessionId,
          filedDocuments: [
            { id: 'own-1', documentOrder: 3 },
            ...block,
            { id: 'own-2', documentOrder: 6 },
          ],
        },
      ])

      await service.fileInCourtSession(caseId, courtSessionId, 'own-3', {
        transaction,
      })

      expect(filedAtOrder()).toBe(7)
    })
  })

  describe('removeFromCourtSession - a copy is never destroyed', () => {
    const caseId = uuid()
    const courtSessionId = uuid()

    it('unfiles a copy with nothing behind it instead of deleting it', async () => {
      courtDocumentModel.findOne.mockResolvedValueOnce({
        id: 'merged-1',
        documentOrder: 2,
        mergedFromCaseId: uuid(),
        caseFileId: undefined,
        generatedPdfUri: undefined,
      })

      await service.removeFromCourtSession(caseId, courtSessionId, 'merged-1', {
        transaction,
      })

      expect(courtDocumentModel.destroy).not.toHaveBeenCalled()
      expect(courtDocumentModel.update).toHaveBeenCalledWith(
        { courtSessionId: null, documentOrder: -1 },
        {
          where: { id: 'merged-1', caseId, courtSessionId },
          transaction,
        },
      )
    })

    it('still deletes one of the case own documents with nothing behind it', async () => {
      courtDocumentModel.findOne.mockResolvedValueOnce({
        id: 'own-1',
        documentOrder: 2,
        caseFileId: undefined,
        generatedPdfUri: undefined,
      })

      await service.removeFromCourtSession(caseId, courtSessionId, 'own-1', {
        transaction,
      })

      expect(courtDocumentModel.destroy).toHaveBeenCalledWith({
        where: { id: 'own-1', caseId, courtSessionId },
        transaction,
      })
    })
  })

  describe('removeAllCourtDocumentsFromCourtSession', () => {
    it('spares the copies from the hard delete and unfiles them with the rest', async () => {
      const caseId = uuid()
      const courtSessionId = uuid()

      await service.removeAllCourtDocumentsFromCourtSession(
        caseId,
        courtSessionId,
        transaction,
      )

      expect(courtDocumentModel.destroy).toHaveBeenCalledWith({
        where: {
          caseId,
          courtSessionId,
          documentType: CourtDocumentType.EXTERNAL_DOCUMENT,
          mergedFromCaseId: null,
        },
        transaction,
      })
      expect(courtDocumentModel.update).toHaveBeenCalledWith(
        { courtSessionId: null, documentOrder: 0 },
        { where: { caseId, courtSessionId }, transaction },
      )
    })
  })
})
