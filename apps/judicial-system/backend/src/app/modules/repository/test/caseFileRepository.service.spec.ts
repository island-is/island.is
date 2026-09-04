import { Op, Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseFileCategory,
  CaseFileState,
  HashAlgorithm,
} from '@island.is/judicial-system/types'

import { CaseFile } from '../models/caseFile.model'
import { CaseFileRepositoryService } from '../services/caseFileRepository.service'

describe('CaseFileRepositoryService', () => {
  const caseId = 'some-case-id'
  const fileId = 'some-file-id'
  const transaction = {} as Transaction

  let service: CaseFileRepositoryService
  let model: {
    findOne: jest.Mock
    findAll: jest.Mock
    max: jest.Mock
    create: jest.Mock
    update: jest.Mock
  }

  beforeEach(async () => {
    model = {
      findOne: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue([]),
      max: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue([0, []]),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(CaseFile), useValue: model },
        CaseFileRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(CaseFileRepositoryService)
  })

  describe('findLiveByIdAndCase', () => {
    it('scopes the lookup to the file within its case and excludes deleted files', async () => {
      const caseFile = { id: fileId }
      model.findOne.mockResolvedValueOnce(caseFile)

      const result = await service.findLiveByIdAndCase(fileId, caseId, {
        transaction,
      })

      expect(model.findOne).toHaveBeenCalledWith({
        where: {
          id: fileId,
          caseId,
          state: { [Op.not]: CaseFileState.DELETED },
        },
        transaction,
      })
      expect(result).toBe(caseFile)
    })

    it('reads outside a transaction when none is given', async () => {
      await service.findLiveByIdAndCase(fileId, caseId)

      expect(model.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ transaction: undefined }),
      )
    })

    it('returns null when there is no such live file', async () => {
      expect(await service.findLiveByIdAndCase(fileId, caseId)).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(service.findLiveByIdAndCase(fileId, caseId)).rejects.toThrow(
        error,
      )
    })
  })

  describe('findByCaseAndPoliceFileId', () => {
    const policeFileId = 'some-police-file-id'

    it('looks the file up by case and police file id within the transaction', async () => {
      const caseFile = { id: fileId }
      model.findOne.mockResolvedValueOnce(caseFile)

      const result = await service.findByCaseAndPoliceFileId(
        caseId,
        policeFileId,
        { transaction },
      )

      expect(model.findOne).toHaveBeenCalledWith({
        where: { caseId, policeFileId },
        transaction,
      })
      expect(result).toBe(caseFile)
    })

    it('returns null when the police file has no case file yet', async () => {
      expect(
        await service.findByCaseAndPoliceFileId(caseId, policeFileId, {
          transaction,
        }),
      ).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(
        service.findByCaseAndPoliceFileId(caseId, policeFileId, {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })

  describe('getNextOrderWithinChapterForUpdate', () => {
    it('locks the uncategorised files of the case before reading the maximum', async () => {
      model.max.mockResolvedValueOnce(2)

      const result = await service.getNextOrderWithinChapterForUpdate(caseId, {
        transaction,
      })

      expect(model.findAll).toHaveBeenCalledWith({
        where: { caseId, category: null },
        attributes: ['id'],
        lock: Transaction.LOCK.UPDATE,
        transaction,
      })
      expect(model.max).toHaveBeenCalledWith('orderWithinChapter', {
        where: { caseId, category: null },
        transaction,
      })
      expect(model.findAll.mock.invocationCallOrder[0]).toBeLessThan(
        model.max.mock.invocationCallOrder[0],
      )
      expect(result).toBe(3)
    })

    it('treats an order of zero as a real maximum', async () => {
      model.max.mockResolvedValueOnce(0)

      expect(
        await service.getNextOrderWithinChapterForUpdate(caseId, {
          transaction,
        }),
      ).toBe(1)
    })

    it('returns null when no uncategorised file has an order yet', async () => {
      expect(
        await service.getNextOrderWithinChapterForUpdate(caseId, {
          transaction,
        }),
      ).toBeNull()
    })

    it('rethrows when taking the lock fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(
        service.getNextOrderWithinChapterForUpdate(caseId, { transaction }),
      ).rejects.toThrow(error)
      expect(model.max).not.toHaveBeenCalled()
    })
  })

  describe('create', () => {
    const caseFile = {
      name: 'test.pdf',
      type: 'application/pdf',
      state: CaseFileState.STORED_IN_RVG,
      key: `${caseId}/${fileId}/test.pdf`,
      size: 99,
      category: CaseFileCategory.PROSECUTOR_CASE_FILE,
    }

    it('creates the file against the case within the transaction', async () => {
      const created = { id: fileId, caseId }
      model.create.mockResolvedValueOnce(created)

      const result = await service.create(caseId, caseFile, { transaction })

      expect(model.create).toHaveBeenCalledWith(
        { ...caseFile, caseId },
        { transaction },
      )
      expect(result).toBe(created)
    })

    it('rethrows when the creation fails', async () => {
      const error = new Error('Some error')
      model.create.mockRejectedValueOnce(error)

      await expect(
        service.create(caseId, caseFile, { transaction }),
      ).rejects.toThrow(error)
    })
  })

  describe('updateById', () => {
    it('updates the file by id and returns the affected row count', async () => {
      model.update.mockResolvedValueOnce([1, []])
      const update = { state: CaseFileState.STORED_IN_COURT }

      const result = await service.updateById(fileId, update)

      expect(model.update).toHaveBeenCalledWith(update, {
        where: { id: fileId },
        transaction: undefined,
      })
      expect(result).toBe(1)
    })

    it('forwards the transaction when one is given', async () => {
      const update = { state: CaseFileState.DELETED, isKeyAccessible: false }

      await service.updateById(fileId, update, { transaction })

      expect(model.update).toHaveBeenCalledWith(update, {
        where: { id: fileId },
        transaction,
      })
    })

    it('rethrows when the update fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.updateById(fileId, {
          hash: 'some-hash',
          hashAlgorithm: HashAlgorithm.SHA256,
        }),
      ).rejects.toThrow(error)
    })
  })

  describe('updateByIdAndCase', () => {
    it('scopes the update to the file within its case and returns the rows', async () => {
      const updated = { id: fileId, policeCaseNumber: '007-2026-1' }
      model.update.mockResolvedValueOnce([1, [updated]])
      const update = { policeCaseNumber: '007-2026-1' }

      const result = await service.updateByIdAndCase(fileId, caseId, update, {
        transaction,
      })

      expect(model.update).toHaveBeenCalledWith(update, {
        where: { id: fileId, caseId },
        returning: true,
        transaction,
      })
      expect(result).toEqual({ numberOfAffectedRows: 1, caseFiles: [updated] })
    })

    it('names both halves of the tuple, including when nothing matched', async () => {
      const result = await service.updateByIdAndCase(fileId, caseId, {
        userGeneratedFilename: null,
      })

      expect(model.update).toHaveBeenCalledWith(
        { userGeneratedFilename: null },
        {
          where: { id: fileId, caseId },
          returning: true,
          transaction: undefined,
        },
      )
      expect(result).toEqual({ numberOfAffectedRows: 0, caseFiles: [] })
    })

    it('rethrows when the update fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.updateByIdAndCase(fileId, caseId, { chapter: 1 }),
      ).rejects.toThrow(error)
    })
  })

  describe('updateByIdAndCaseWithoutDocument', () => {
    const update = {
      key: `${caseId}/${fileId}/urskurdur.pdf`,
      size: 1234,
      type: 'application/pdf',
      name: 'urskurdur.pdf',
    }

    it('matches only a file that still has no document', async () => {
      const updated = { id: fileId, ...update }
      model.update.mockResolvedValueOnce([1, [updated]])

      const result = await service.updateByIdAndCaseWithoutDocument(
        fileId,
        caseId,
        update,
        { transaction },
      )

      expect(model.update).toHaveBeenCalledWith(update, {
        where: { id: fileId, caseId, key: '' },
        returning: true,
        transaction,
      })
      expect(result).toEqual({ numberOfAffectedRows: 1, caseFiles: [updated] })
    })

    it('reports no affected rows when the file already has a document', async () => {
      const result = await service.updateByIdAndCaseWithoutDocument(
        fileId,
        caseId,
        update,
        { transaction },
      )

      expect(result).toEqual({ numberOfAffectedRows: 0, caseFiles: [] })
    })

    it('rethrows when the update fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.updateByIdAndCaseWithoutDocument(fileId, caseId, update, {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })

  describe('resetStoredInCourtFilesForCase', () => {
    it('moves the files stored in court back to RVG and returns the count', async () => {
      model.update.mockResolvedValueOnce([2, []])

      const result = await service.resetStoredInCourtFilesForCase(caseId, {
        transaction,
      })

      expect(model.update).toHaveBeenCalledWith(
        { state: CaseFileState.STORED_IN_RVG },
        {
          where: { caseId, state: CaseFileState.STORED_IN_COURT },
          transaction,
        },
      )
      expect(result).toBe(2)
    })

    it('rethrows when the update fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.resetStoredInCourtFilesForCase(caseId, { transaction }),
      ).rejects.toThrow(error)
    })
  })

  describe('findAllByCaseAndCategories', () => {
    const categories = [
      CaseFileCategory.CASE_FILE,
      CaseFileCategory.PROSECUTOR_CASE_FILE,
    ]

    it('loads the files of the case in exactly the given categories', async () => {
      const caseFiles = [{ id: fileId }]
      model.findAll.mockResolvedValueOnce(caseFiles)

      const result = await service.findAllByCaseAndCategories(
        caseId,
        categories,
        { transaction },
      )

      expect(model.findAll).toHaveBeenCalledWith({
        where: { caseId, category: categories },
        transaction,
      })
      expect(result).toBe(caseFiles)
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findAll.mockRejectedValueOnce(error)

      await expect(
        service.findAllByCaseAndCategories(caseId, categories, {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })

  describe('copyToCase', () => {
    const newCaseId = 'some-new-case-id'
    const policeFileId = 'some-police-file-id'
    const sourceFile = {
      id: fileId,
      caseId,
      policeFileId,
      toJSON: () => ({
        id: fileId,
        caseId,
        name: 'document.pdf',
        category: CaseFileCategory.CASE_FILE,
        key: `${caseId}/abc/document.pdf`,
        state: CaseFileState.STORED_IN_COURT,
        defendantId: 'old-defendant-id',
        civilClaimantId: 'old-civil-claimant-id',
        policeFileId,
        hash: 'some-hash',
        hashAlgorithm: HashAlgorithm.SHA256,
      }),
    } as unknown as CaseFile

    it('creates the copy on the new case at the new key as an independent draft file', async () => {
      const created = { id: 'new-file-id' }
      model.create.mockResolvedValueOnce(created)

      const result = await service.copyToCase(
        sourceFile,
        newCaseId,
        {
          key: `${newCaseId}/def/document.pdf`,
          defendantId: 'new-defendant-id',
          civilClaimantId: 'new-civil-claimant-id',
        },
        { transaction },
      )

      expect(model.create).toHaveBeenCalledWith(
        {
          id: undefined,
          caseId: newCaseId,
          name: 'document.pdf',
          category: CaseFileCategory.CASE_FILE,
          key: `${newCaseId}/def/document.pdf`,
          // Back to being stored only in RVG
          state: CaseFileState.STORED_IN_RVG,
          // Pointed at the copies of the defendant and civil claimant
          defendantId: 'new-defendant-id',
          civilClaimantId: 'new-civil-claimant-id',
          // The police file reference is kept so the file is not offered for
          // re-upload from the police system
          policeFileId,
          // The hash was computed for the original key and is no longer valid
          hash: undefined,
          hashAlgorithm: undefined,
        },
        { transaction },
      )
      expect(result).toBe(created)
    })

    it('leaves the defendant and civil claimant references empty when the caller has none', async () => {
      await service.copyToCase(
        sourceFile,
        newCaseId,
        { key: `${newCaseId}/def/document.pdf` },
        { transaction },
      )

      expect(model.create).toHaveBeenCalledWith(
        expect.objectContaining({
          defendantId: undefined,
          civilClaimantId: undefined,
        }),
        { transaction },
      )
    })

    it('rethrows when the creation fails', async () => {
      const error = new Error('Some error')
      model.create.mockRejectedValueOnce(error)

      await expect(
        service.copyToCase(
          sourceFile,
          newCaseId,
          { key: `${newCaseId}/def/document.pdf` },
          { transaction },
        ),
      ).rejects.toThrow(error)
    })
  })
})
