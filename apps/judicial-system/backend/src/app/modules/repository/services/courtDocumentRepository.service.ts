import _uniqBy from 'lodash/uniqBy'
import { literal, Op, Transaction, UpdateOptions } from 'sequelize'

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseFileCategory,
  CourtDocumentType,
} from '@island.is/judicial-system/types'

import { CaseFile } from '../models/caseFile.model'
import { CourtDocument } from '../models/courtDocument.model'
import { CourtSession } from '../models/courtSession.model'

interface CreateCourtDocumentOptions {
  transaction: Transaction
}

export interface CreateCourtDocument {
  documentType: CourtDocumentType
  name: string
  caseFileId?: string
  generatedPdfUri?: string
}

interface UpdateCourtDocumentOptions {
  transaction: Transaction
}

interface UpdateCourtDocument {
  documentOrder?: number
  mergedDocumentOrder?: number
  name?: string
  submittedBy?: string
}

interface FileAllAvailableCourtDocumentsInCourtSessionOptions {
  transaction: Transaction
}

interface FindMergedCaseIdsFiledInCourtSessionOptions {
  transaction: Transaction
}

interface FileCourtDocumentInCourtSessionOptions {
  transaction: Transaction
}

interface RemoveCourtDocumentFromCourtSessionOptions {
  transaction: Transaction
}

interface DeleteCourtDocumentOptions {
  transaction: Transaction
}

@Injectable()
export class CourtDocumentRepositoryService {
  constructor(
    @InjectModel(CourtDocument)
    private readonly courtDocumentModel: typeof CourtDocument,
    @InjectModel(CourtSession)
    private readonly courtSessionModel: typeof CourtSession,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    caseId: string,
    data: CreateCourtDocument,
    options: CreateCourtDocumentOptions,
  ): Promise<CourtDocument> {
    try {
      this.logger.debug(
        `Creating a new court document of case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      // Find the last court session for the case, if any
      const lastCourtSession = await this.courtSessionModel.findOne({
        where: { caseId },
        order: [['created', 'DESC']],
        transaction: options.transaction,
      })

      const courtSessionId =
        lastCourtSession && !lastCourtSession.isConfirmed
          ? lastCourtSession.id
          : undefined

      if (courtSessionId) {
        return this.createInCourtSession(caseId, courtSessionId, data, options)
      }

      const courtDocument = await this.courtDocumentModel.create(
        { ...data, caseId, documentOrder: 0 },
        options,
      )

      this.logger.debug(
        `Created a new court document ${courtDocument.id} of case ${caseId}`,
      )

      return courtDocument
    } catch (error) {
      this.logger.error(
        `Error creating a new court document of case ${caseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }

  async createInCourtSession(
    caseId: string,
    courtSessionId: string,
    data: CreateCourtDocument,
    options: CreateCourtDocumentOptions,
  ): Promise<CourtDocument> {
    try {
      this.logger.debug(
        `Creating a new court document for court session ${courtSessionId} of case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      // Make space for the next court session document
      const nextOrder = await this.makeNextCourtSessionDocumentOrderAvailable({
        caseId,
        courtSessionId,
        courtDocumentId: undefined,
        transaction: options.transaction,
      })

      const courtDocument = await this.courtDocumentModel.create(
        { ...data, caseId, courtSessionId, documentOrder: nextOrder },
        options,
      )

      this.logger.debug(
        `Created a new court document ${courtDocument.id} for court session ${courtSessionId} of case ${caseId}`,
      )

      return courtDocument
    } catch (error) {
      this.logger.error(
        `Error creating a new court document for court session ${courtSessionId} of case ${caseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }

  private async updateFiledDocumentsOrder({
    documentOrder,
    caseId,
    courtSessionId,
    courtDocumentId,
    transaction,
  }: {
    documentOrder: number
    caseId: string
    courtSessionId: string
    courtDocumentId: string
    transaction: Transaction
  }): Promise<void> {
    // Get and lock the filed documents for the court session ordered by document order
    const filedDocuments = await this.courtDocumentModel.findAll({
      where: { caseId, courtSessionId },
      order: [['documentOrder', 'ASC']],
      lock: transaction.LOCK.UPDATE,
      transaction,
    })

    const currentDocument = filedDocuments.find((d) => d.id === courtDocumentId)

    if (!currentDocument) {
      throw new InternalServerErrorException(
        `Could not find court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
      )
    }

    const newOrder = documentOrder
    const firstOrder = filedDocuments[0].documentOrder
    const lastOrder = filedDocuments[filedDocuments.length - 1].documentOrder

    // Validate the document order bounds
    if (newOrder < firstOrder || newOrder > lastOrder) {
      throw new BadRequestException(
        `Order must be between ${firstOrder} and ${lastOrder}`,
      )
    }

    const currentOrder = currentDocument.documentOrder

    // Play the move out against the session as it stands and refuse it if it
    // would break up a merged case's section of the record.
    const reordered = [...filedDocuments]
    reordered.splice(reordered.indexOf(currentDocument), 1)
    reordered.splice(newOrder - firstOrder, 0, currentDocument)

    this.assertMergedCaseBlocksStayTogether(caseId, reordered)

    // Only adjust other documents if the document order is actually changing
    if (currentOrder !== newOrder) {
      if (newOrder > currentOrder) {
        // Moving down: decrease order of documents between current and new position
        await this.courtDocumentModel.update(
          { documentOrder: literal('document_order - 1') },
          {
            where: {
              caseId,
              courtSessionId,
              documentOrder: { [Op.gt]: currentOrder, [Op.lte]: newOrder },
            },
            transaction,
          },
        )
      } else {
        // Moving up: increase order of documents between new and current position
        await this.courtDocumentModel.update(
          { documentOrder: literal('document_order + 1') },
          {
            where: {
              caseId,
              courtSessionId,
              documentOrder: { [Op.gte]: newOrder, [Op.lt]: currentOrder },
            },
            transaction,
          },
        )
      }
    }
  }

  private async updateMergedFiledDocumentsOrder({
    mergedDocumentOrder,
    courtSessionId,
    courtDocumentId,
    transaction,
  }: {
    mergedDocumentOrder: number
    courtSessionId: string
    courtDocumentId: string
    transaction: Transaction
  }): Promise<void> {
    // Get and lock the merged filed documents for the court session ordered by merged document order
    const mergedFiledDocuments = await this.courtDocumentModel.findAll({
      where: { mergedCourtSessionId: courtSessionId },
      order: [['mergedDocumentOrder', 'ASC']],
      lock: transaction.LOCK.UPDATE,
      transaction,
    })

    const currentMergedDocument = mergedFiledDocuments.find(
      (d) => d.id === courtDocumentId,
    )

    if (!currentMergedDocument) {
      throw new InternalServerErrorException(
        `Could not find court document ${courtDocumentId} for court session ${courtSessionId}`,
      )
    }

    const newOrder = mergedDocumentOrder
    const firstOrder = mergedFiledDocuments[0].mergedDocumentOrder
    const lastOrder =
      mergedFiledDocuments[mergedFiledDocuments.length - 1].mergedDocumentOrder

    // Validate the document order bounds
    if (!firstOrder || !lastOrder) {
      throw new BadRequestException(`Invalid merged order`)
    }
    if (newOrder < firstOrder || newOrder > lastOrder) {
      throw new BadRequestException(
        `Order must be between ${firstOrder} and ${lastOrder}`,
      )
    }

    const currentOrder = currentMergedDocument.mergedDocumentOrder

    // Only adjust other documents if the document order is actually changing
    if (currentOrder && currentOrder !== newOrder) {
      if (newOrder > currentOrder) {
        // Moving down: decrease order of documents between current and new position
        await this.courtDocumentModel.update(
          { mergedDocumentOrder: literal('merged_document_order - 1') },
          {
            where: {
              mergedCourtSessionId: courtSessionId,
              mergedDocumentOrder: {
                [Op.gt]: currentOrder,
                [Op.lte]: newOrder,
              },
            },
            transaction,
          },
        )
      } else {
        // Moving up: increase order of documents between new and current position
        await this.courtDocumentModel.update(
          { mergedDocumentOrder: literal('merged_document_order + 1') },
          {
            where: {
              mergedCourtSessionId: courtSessionId,
              mergedDocumentOrder: {
                [Op.gte]: newOrder,
                [Op.lt]: currentOrder,
              },
            },
            transaction,
          },
        )
      }
    }
  }

  async update(
    caseId: string,
    courtSessionId: string,
    courtDocumentId: string,
    data: UpdateCourtDocument,
    options: UpdateCourtDocumentOptions,
  ): Promise<CourtDocument> {
    try {
      this.logger.debug(
        `Updating court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const updateOptions: UpdateOptions = {
        where: {
          id: courtDocumentId,
          [Op.or]: [
            { courtSessionId },
            { mergedCourtSessionId: courtSessionId },
          ],
        },
        transaction: options.transaction,
      }

      if (data.documentOrder !== undefined) {
        // If the document order is being updated, we need special handling
        await this.updateFiledDocumentsOrder({
          documentOrder: data.documentOrder,
          caseId,
          courtSessionId,
          courtDocumentId,
          transaction: options.transaction,
        })
      } else if (data.mergedDocumentOrder !== undefined) {
        // If the merged document order is being updated, we need special handling.
        // We ensure that the original document order from the original case is not modified,
        // only the merged document order of the linked documents
        await this.updateMergedFiledDocumentsOrder({
          mergedDocumentOrder: data.mergedDocumentOrder,
          courtSessionId,
          courtDocumentId,
          transaction: options.transaction,
        })
      }

      const [numberOfAffectedRows, courtDocuments] =
        await this.courtDocumentModel.update(data, {
          ...updateOptions,
          returning: true,
        })

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId} with data:`,
          { data: Object.keys(data) },
        )
      }

      this.logger.debug(
        `Updated court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
      )

      return courtDocuments[0]
    } catch (error) {
      this.logger.error(
        `Error updating court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }

  // Brings the court documents of a case merged into this one before the
  // parent's court, by copying them into the parent's court session: new rows
  // owned by the parent case, each naming the case it came from, placed as one
  // contiguous block at the end of the session.
  //
  // The merged case's own documents are left untouched, so what the parent's
  // court record says was laid before it is a snapshot - a later correction in
  // the merged case does not reach into it. The copies share the originals'
  // case files, because it is the same document.
  //
  // Copying happens once per merged case: a merged case whose documents are
  // already in the parent is left alone, however the parent has since
  // rearranged, removed or renamed them. Returns whether anything was copied,
  // which is what tells the caller a merged case has entered the record.
  async copyMergedCaseCourtDocumentsIntoCourtSession({
    parentCaseId,
    parentCaseCourtSessionId,
    mergedCaseId,
    transaction,
  }: {
    parentCaseId: string
    parentCaseCourtSessionId: string
    mergedCaseId: string
    transaction: Transaction
  }): Promise<boolean> {
    try {
      this.logger.debug(
        `Copying court documents of case ${mergedCaseId} into court session ${parentCaseCourtSessionId} of case ${parentCaseId}`,
      )

      const numAlreadyCopied = await this.courtDocumentModel.count({
        where: { caseId: parentCaseId, mergedFromCaseId: mergedCaseId },
        transaction,
      })

      if (numAlreadyCopied > 0) {
        this.logger.debug(
          `Court documents of case ${mergedCaseId} are already in case ${parentCaseId}`,
        )

        return false
      }

      // Check if the case has court sessions, to determine which court documents to include
      const numCourtSessions = await this.courtSessionModel.count({
        where: { caseId: mergedCaseId },
        transaction,
      })

      const courtDocumentsToCopy = await this.courtDocumentModel.findAll({
        where:
          numCourtSessions > 0
            ? {
                caseId: mergedCaseId,
                mergedFromCaseId: null,
                courtSessionId: { [Op.ne]: null },
                documentOrder: { [Op.gt]: 0 },
              }
            : { caseId: mergedCaseId, mergedFromCaseId: null },
        order: [
          ['documentOrder', 'ASC'],
          ['created', 'ASC'],
        ],
        transaction,
      })

      if (courtDocumentsToCopy.length === 0) {
        this.logger.debug(`No documents to copy from case ${mergedCaseId}`)

        return false
      }

      const nextOrder = await this.makeNextCourtSessionDocumentOrderAvailable({
        caseId: parentCaseId,
        courtSessionId: parentCaseCourtSessionId,
        reservedSlots: courtDocumentsToCopy.length,
        courtDocumentId: undefined,
        transaction,
      })

      await this.courtDocumentModel.bulkCreate(
        courtDocumentsToCopy.map((courtDocument, index) => ({
          caseId: parentCaseId,
          courtSessionId: parentCaseCourtSessionId,
          documentOrder: nextOrder + index,
          mergedFromCaseId: mergedCaseId,
          documentType: courtDocument.documentType,
          name: courtDocument.name,
          caseFileId: courtDocument.caseFileId,
          generatedPdfUri: courtDocument.generatedPdfUri,
          submittedBy: courtDocument.submittedBy,
        })),
        { transaction },
      )

      this.logger.debug(
        `Copied ${courtDocumentsToCopy.length} court documents of case ${mergedCaseId} into court session ${parentCaseCourtSessionId} of case ${parentCaseId}`,
      )

      return true
    } catch (error) {
      this.logger.error(
        `Error copying court documents of case ${mergedCaseId} into court session ${parentCaseCourtSessionId} of case ${parentCaseId}: `,
        { error },
      )

      throw error
    }
  }

  // The cases merged into this one whose documents are filed in a court
  // session, in the order their blocks appear in the court record.
  async findMergedCaseIdsFiledInCourtSession(
    caseId: string,
    courtSessionId: string,
    options: FindMergedCaseIdsFiledInCourtSessionOptions,
  ): Promise<string[]> {
    try {
      const courtDocuments = await this.courtDocumentModel.findAll({
        where: {
          caseId,
          courtSessionId,
          mergedFromCaseId: { [Op.ne]: null },
        },
        attributes: ['mergedFromCaseId', 'documentOrder'],
        order: [['documentOrder', 'ASC']],
        transaction: options.transaction,
      })

      return [
        ...new Set(
          courtDocuments.flatMap((courtDocument) =>
            courtDocument.mergedFromCaseId
              ? [courtDocument.mergedFromCaseId]
              : [],
          ),
        ),
      ]
    } catch (error) {
      this.logger.error(
        `Error finding merged cases filed in court session ${courtSessionId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async fileAllAvailableCourtDocumentsInCourtSession(
    caseId: string,
    courtSessionId: string,
    options: FileAllAvailableCourtDocumentsInCourtSessionOptions,
  ): Promise<void> {
    try {
      this.logger.debug(
        `Filing all available court documents in court session ${courtSessionId} of case ${caseId}`,
      )

      const transaction = options.transaction

      // Get all court documents that are not yet filed in a court session.
      // Court documents backed by an "Önnur gögn" case file
      // (CaseFileCategory.CASE_FILE) must NOT be auto-filed onto the court
      // record. They stay unfiled so court users can file them manually.
      // Generated documents (indictment, skjalaskrá, subpoenas) have no
      // backing case file (caseFileId == null) and are always auto-filed, as
      // are party-category case files.
      //
      // documentOrder 0 is the available pool, which a copy from a merged case
      // returns to when its court session is deleted. A document the court
      // removed from the record is left at -1 and is not swept back in here -
      // it waits to be filed by hand.
      const courtDocumentsToFile = await this.courtDocumentModel.findAll({
        attributes: ['id', 'created', 'mergedFromCaseId'],
        where: {
          caseId,
          courtSessionId: null,
          documentOrder: 0,
          [Op.or]: [
            { caseFileId: null },
            { '$caseFile.category$': { [Op.ne]: CaseFileCategory.CASE_FILE } },
          ],
        },
        include: [
          { model: CaseFile, as: 'caseFile', attributes: [], required: false },
        ],
        order: [['created', 'ASC']],
        transaction,
      })

      if (courtDocumentsToFile.length === 0) {
        this.logger.debug(
          `No available court documents to file in case ${caseId}`,
        )
        return
      }

      const orderedCourtDocumentsToFile =
        this.orderAvailableCourtDocuments(courtDocumentsToFile)

      const nextOrder = await this.makeNextCourtSessionDocumentOrderAvailable({
        caseId,
        courtSessionId,
        reservedSlots: orderedCourtDocumentsToFile.length,
        courtDocumentId: undefined,
        transaction,
      })

      // File all documents in the court session
      for (let i = 0; i < orderedCourtDocumentsToFile.length; i++) {
        await this.courtDocumentModel.update(
          { courtSessionId, documentOrder: nextOrder + i },
          { where: { id: orderedCourtDocumentsToFile[i].id }, transaction },
        )
      }

      this.logger.debug(
        `Filed all available court documents in court session ${courtSessionId} of case ${caseId}`,
      )

      return
    } catch (error) {
      this.logger.error(
        `Error filing all available court documents in court session ${courtSessionId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async fileInCourtSession(
    caseId: string,
    courtSessionId: string,
    courtDocumentId: string,
    options: FileCourtDocumentInCourtSessionOptions,
  ): Promise<CourtDocument> {
    try {
      this.logger.debug(
        `Filing court document ${courtDocumentId} in court session ${courtSessionId} of case ${caseId}`,
      )

      // A copy from a merged case rejoins its own section of the record rather
      // than the end of the session, so where it goes depends on which case it
      // came from.
      const courtDocumentToFile = await this.courtDocumentModel.findOne({
        where: { id: courtDocumentId, caseId },
        transaction: options.transaction,
      })

      if (!courtDocumentToFile) {
        throw new InternalServerErrorException(
          `Could not find court document ${courtDocumentId} of case ${caseId}`,
        )
      }

      // Make space for the next court session document
      const nextOrder = await this.makeNextCourtSessionDocumentOrderAvailable({
        caseId,
        courtSessionId,
        courtDocumentId,
        mergedFromCaseId: courtDocumentToFile.mergedFromCaseId,
        transaction: options.transaction,
      })

      const [numberOfAffectedRows, courtDocuments] =
        await this.courtDocumentModel.update(
          { courtSessionId, documentOrder: nextOrder },
          {
            where: { id: courtDocumentId, caseId },
            transaction: options.transaction,
            returning: true,
          },
        )

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not file court document ${courtDocumentId} in court session ${courtSessionId} of case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when filing court document ${courtDocumentId} in court session ${courtSessionId} of case ${caseId}`,
        )
      }

      this.logger.debug(
        `Filed court document ${courtDocumentId} in court session ${courtSessionId} of case ${caseId}`,
      )

      return courtDocuments[0]
    } catch (error) {
      this.logger.error(
        `Error filing court document ${courtDocumentId} in court session ${courtSessionId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  // The case's own documents first, then the documents copied from each merged
  // case as one contiguous block, oldest merge first. Deleting a court session
  // strips the order from every document it held, so created is all that is
  // left to sequence them by when the next session takes them in again.
  private orderAvailableCourtDocuments(
    courtDocuments: CourtDocument[],
  ): CourtDocument[] {
    const ownCourtDocuments: CourtDocument[] = []
    const blocks = new Map<string, CourtDocument[]>()

    for (const courtDocument of courtDocuments) {
      const mergedFromCaseId = courtDocument.mergedFromCaseId

      if (!mergedFromCaseId) {
        ownCourtDocuments.push(courtDocument)

        continue
      }

      const block = blocks.get(mergedFromCaseId)

      if (block) {
        block.push(courtDocument)
      } else {
        blocks.set(mergedFromCaseId, [courtDocument])
      }
    }

    // The documents arrive oldest first, so each block opens with its oldest.
    const orderedBlocks = [...blocks.values()].sort((a, b) =>
      a[0].created < b[0].created ? -1 : a[0].created > b[0].created ? 1 : 0,
    )

    return [...ownCourtDocuments, ...orderedBlocks.flat()]
  }

  // The documents copied from one merged case are that case's section of the
  // court record, so they stay together: one contiguous run within one court
  // session. Refuses an arrangement that would break a section up - a copy
  // taken out of its own, or one of the case's own documents put inside it.
  private assertMergedCaseBlocksStayTogether(
    caseId: string,
    courtDocuments: CourtDocument[],
  ): void {
    const startedBlocks = new Set<string>()
    let currentBlock: string | undefined

    for (const courtDocument of courtDocuments) {
      const mergedFromCaseId = courtDocument.mergedFromCaseId ?? undefined

      if (mergedFromCaseId === currentBlock) {
        continue
      }

      if (mergedFromCaseId) {
        if (startedBlocks.has(mergedFromCaseId)) {
          throw new BadRequestException(
            `The court documents of merged case ${mergedFromCaseId} must stay together in case ${caseId}`,
          )
        }

        startedBlocks.add(mergedFromCaseId)
      }

      currentBlock = mergedFromCaseId
    }
  }

  private getMergedCaseIds(courtSessions: CourtSession[]): string[] {
    return courtSessions.flatMap((courtSession) =>
      _uniqBy(
        courtSession.mergedFiledDocuments ?? [],
        (c: CourtDocument) => c.caseId,
      ).map((courtDocument) => courtDocument.caseId),
    )
  }

  async removeFromCourtSession(
    caseId: string,
    courtSessionId: string,
    courtDocumentId: string,
    options: RemoveCourtDocumentFromCourtSessionOptions,
  ): Promise<void> {
    try {
      this.logger.debug(
        `Deleting court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
      )

      const transaction = options.transaction

      // Lock all court documents for the case to prevent race conditions
      await this.courtDocumentModel.findAll({
        where: { caseId },
        attributes: ['id'],
        lock: transaction.LOCK.UPDATE,
        transaction,
      })

      // Get the document to find its order before deletion
      const documentToRemove = await this.courtDocumentModel.findOne({
        where: { id: courtDocumentId, caseId, courtSessionId },
        transaction,
      })

      if (!documentToRemove) {
        throw new InternalServerErrorException(
          `Could not find court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
        )
      }

      const removeOrder = documentToRemove.documentOrder

      // Delete the document, unless it is a copy from a merged case: a copy is
      // never destroyed, so that the court can always put it back. It goes to
      // the available documents, where its merged case's section offers it for
      // re-filing, and the -1 order keeps a new court session from sweeping it
      // back in on its own.
      if (
        !documentToRemove.mergedFromCaseId &&
        !documentToRemove.caseFileId &&
        !documentToRemove.generatedPdfUri
      ) {
        await this.deleteFromDatabase(
          caseId,
          courtSessionId,
          courtDocumentId,
          transaction,
        )
      } else {
        await this.courtDocumentModel.update(
          { courtSessionId: null, documentOrder: -1 },
          {
            where: { id: courtDocumentId, caseId, courtSessionId },
            transaction,
          },
        )
      }

      // Adjust order of remaining documents that had higher order values
      await this.updateCourtDocumentOrderAfterRemove(
        caseId,
        removeOrder,
        transaction,
      )

      this.logger.debug(
        `Deleted court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId} and adjusted remaining document orders`,
      )
    } catch (error) {
      this.logger.error(
        `Error deleting court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async deleteByCaseFileId(
    caseId: string,
    caseFileId: string,
    options: DeleteCourtDocumentOptions,
  ): Promise<void> {
    try {
      this.logger.debug(
        `Deleting court document for case file id ${caseFileId} of case ${caseId}`,
      )

      const transaction = options.transaction

      // Lock all court documents for the case to prevent race conditions
      await this.courtDocumentModel.findAll({
        where: { caseId },
        attributes: ['id'],
        lock: transaction.LOCK.UPDATE,
        transaction,
      })

      // Get the document to find its order before deletion
      const documentToDelete = await this.courtDocumentModel.findOne({
        where: { caseFileId, caseId },
        transaction,
      })

      if (!documentToDelete) {
        this.logger.debug(
          `Nothing to delete - could not find a court document for case file id ${caseFileId} of case ${caseId}`,
        )

        return
      }

      const deletedOrder = documentToDelete.documentOrder

      // Delete the document
      await this.deleteFromDatabase(
        caseId,
        documentToDelete.courtSessionId ?? null,
        documentToDelete.id,
        transaction,
      )

      // If needed, adjust order of remaining documents that had higher order values
      if (deletedOrder > 0) {
        await this.updateCourtDocumentOrderAfterRemove(
          caseId,
          deletedOrder,
          transaction,
        )
      }

      this.logger.debug(
        `Deleted court document for case file id ${caseFileId} of case ${caseId} and adjusted remaining document orders`,
      )
    } catch (error) {
      this.logger.error(
        `Error deleting court document for case file id ${caseFileId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  private async updateCourtDocumentOrderAfterRemove(
    caseId: string,
    deletedOrder: number,
    transaction: Transaction,
  ) {
    await this.courtDocumentModel.update(
      { documentOrder: literal('document_order - 1') },
      {
        where: { caseId, documentOrder: { [Op.gt]: deletedOrder } },
        transaction,
      },
    )

    const courtSessions = await this.courtSessionModel.findAll({
      where: { caseId },
      include: [{ model: CourtDocument, as: 'mergedFiledDocuments' }],
      order: [
        ['created', 'ASC'],
        [
          { model: CourtDocument, as: 'mergedFiledDocuments' },
          'mergedDocumentOrder',
          'ASC',
        ],
      ],
      transaction,
    })

    const mergedCaseIds = this.getMergedCaseIds(courtSessions)

    if (mergedCaseIds.length > 0) {
      await this.courtDocumentModel.update(
        { mergedDocumentOrder: literal('merged_document_order - 1') },
        {
          where: {
            caseId: mergedCaseIds,
            mergedDocumentOrder: { [Op.gt]: deletedOrder },
          },
          transaction,
        },
      )
    }
  }

  async removeAllCourtDocumentsFromCourtSession(
    caseId: string,
    courtSessionId: string,
    transaction: Transaction,
  ) {
    try {
      // Note that this method should only be called for the latest court session
      // so no adjustment is need to document orders

      this.logger.debug(
        `Removing all court documents from court session ${courtSessionId} of case ${caseId}`,
      )

      // Lock all court documents for the case to prevent race conditions
      await this.courtDocumentModel.findAll({
        where: { caseId },
        attributes: ['id'],
        lock: transaction.LOCK.UPDATE,
        transaction,
      })

      // Count the documents to remove
      const numDocumentsToDelete = await this.courtDocumentModel.count({
        where: { caseId, courtSessionId },
        transaction,
      })

      // Fisically delete all external documents in the court session, except
      // the ones copied from a merged case: a copy is never destroyed, it is
      // unfiled with everything else below and the next court session takes it
      // back in as part of its merged case's block.
      await this.courtDocumentModel.destroy({
        where: {
          caseId,
          courtSessionId,
          documentType: CourtDocumentType.EXTERNAL_DOCUMENT,
          mergedFromCaseId: null,
        },
        transaction,
      })

      // Unfile the remaining documents in the court session
      await this.courtDocumentModel.update(
        { courtSessionId: null, documentOrder: 0 },
        { where: { caseId, courtSessionId }, transaction },
      )

      // Count the merged documents to remove
      const numMergedDocumentsToDelete = await this.courtDocumentModel.count({
        where: { mergedCourtSessionId: courtSessionId },
        transaction,
      })

      // Unfile all merged documents linked to the court session
      await this.courtDocumentModel.update(
        { mergedCourtSessionId: null, mergedDocumentOrder: null },
        {
          where: { mergedCourtSessionId: courtSessionId },
          transaction,
        },
      )

      this.logger.debug(
        `Deleted ${numDocumentsToDelete} court documents and ${numMergedDocumentsToDelete} merged court documents from court session ${courtSessionId} of case ${caseId}`,
      )
    } catch (error) {
      this.logger.error(
        `Error deleting all court documents from court session ${courtSessionId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  private async makeNextCourtSessionDocumentOrderAvailable({
    caseId,
    courtSessionId,
    reservedSlots = 1,
    courtDocumentId,
    mergedFromCaseId,
    transaction,
  }: {
    caseId: string
    courtSessionId: string
    reservedSlots?: number
    courtDocumentId: string | undefined
    mergedFromCaseId?: string
    transaction: Transaction
  }) {
    // Lock all court documents for the case to prevent race conditions
    await this.courtDocumentModel.findAll({
      where: { caseId },
      attributes: ['id'],
      lock: transaction.LOCK.UPDATE,
      transaction,
    })

    // Get all court sessions and filed documents for the case
    const courtSessions = await this.courtSessionModel.findAll({
      where: { caseId },
      include: [
        { model: CourtDocument, as: 'filedDocuments' },
        { model: CourtDocument, as: 'mergedFiledDocuments' },
      ],
      order: [
        ['created', 'ASC'],
        [
          { model: CourtDocument, as: 'filedDocuments' },
          'documentOrder',
          'ASC',
        ],
        [
          { model: CourtDocument, as: 'mergedFiledDocuments' },
          'mergedDocumentOrder',
          'ASC',
        ],
      ],
      transaction,
    })

    const alreadyFiled =
      Boolean(courtDocumentId) &&
      courtSessions.some((c) =>
        c.filedDocuments?.some((d) => d.id === courtDocumentId),
      )

    if (alreadyFiled) {
      throw new BadRequestException(
        `Court document ${courtDocumentId} of case ${caseId} is already filed in a court session`,
      )
    }

    // Find the next document order value for this court session
    let nextOrder = 1
    for (const s of courtSessions) {
      if (s.filedDocuments && s.filedDocuments.length > 0) {
        nextOrder =
          s.filedDocuments[s.filedDocuments.length - 1].documentOrder + 1
      }

      if (s.id === courtSessionId) {
        break
      }

      // set next order based on merge documents in previous court sessions only
      if (s.mergedFiledDocuments && s.mergedFiledDocuments.length > 0) {
        const lastMergedDocument =
          s.mergedFiledDocuments[s.mergedFiledDocuments.length - 1]
        if (lastMergedDocument.mergedDocumentOrder) {
          nextOrder = lastMergedDocument.mergedDocumentOrder + 1
        }
      }
    }

    // A copy from a merged case goes at the end of that case's section of the
    // record, not at the end of the session, and only into the session that
    // holds the section - the court record renders each merged case as one
    // block, and a section split across two sessions has no meaning.
    if (mergedFromCaseId) {
      const blockCourtDocuments = courtSessions.flatMap((s) =>
        (s.filedDocuments ?? []).filter(
          (d) => d.mergedFromCaseId === mergedFromCaseId,
        ),
      )

      if (blockCourtDocuments.length > 0) {
        const blockCourtSessionId = blockCourtDocuments[0].courtSessionId

        if (blockCourtSessionId !== courtSessionId) {
          throw new BadRequestException(
            `Court documents of merged case ${mergedFromCaseId} are filed in court session ${blockCourtSessionId} of case ${caseId}`,
          )
        }

        nextOrder =
          Math.max(...blockCourtDocuments.map((d) => d.documentOrder)) + 1
      }
    }

    // Increase order of documents after the current position
    await this.courtDocumentModel.update(
      { documentOrder: literal(`document_order + ${reservedSlots}`) },
      {
        where: { caseId, documentOrder: { [Op.gte]: nextOrder } },
        transaction,
      },
    )

    const mergedCaseIds = this.getMergedCaseIds(courtSessions)

    if (mergedCaseIds.length > 0) {
      // Increase order of potential merged documents after the current position
      await this.courtDocumentModel.update(
        {
          mergedDocumentOrder: literal(
            `merged_document_order + ${reservedSlots}`,
          ),
        },
        {
          where: {
            caseId: mergedCaseIds,
            mergedDocumentOrder: { [Op.gte]: nextOrder },
          },
          transaction,
        },
      )
    }

    return nextOrder
  }

  private async deleteFromDatabase(
    caseId: string,
    courtSessionId: string | null,
    courtDocumentId: string,
    transaction: Transaction,
  ) {
    const numberOfDeletedRows = await this.courtDocumentModel.destroy({
      where: { id: courtDocumentId, caseId, courtSessionId },
      transaction,
    })

    if (numberOfDeletedRows < 1) {
      throw new InternalServerErrorException(
        `Could not delete court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
      )
    }

    if (numberOfDeletedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfDeletedRows}) affected when deleting court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
      )
    }
  }
}
