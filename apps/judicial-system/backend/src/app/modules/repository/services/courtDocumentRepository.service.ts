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

import { CourtDocumentType } from '@island.is/judicial-system/types'

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

  async updateMergedCourtDocuments({
    parentCaseId,
    parentCaseCourtSessionId,
    caseId,
    transaction,
  }: {
    parentCaseId: string
    parentCaseCourtSessionId: string
    caseId: string
    transaction: Transaction
  }) {
    try {
      this.logger.debug(
        `Updating court documents of case ${caseId} to be linked to court session ${parentCaseCourtSessionId} of case ${parentCaseId}`,
      )

      const filedDocumentsInMergedCaseCount =
        await this.courtDocumentModel.count({
          where: {
            caseId,
            courtSessionId: { [Op.ne]: null },
            documentOrder: { [Op.gt]: 0 },
          },
          transaction,
        })
      if (filedDocumentsInMergedCaseCount === 0) {
        this.logger.debug(`No filed documents to merge from case ${caseId}`)
        return
      }

      const nextOrder = await this.makeNextCourtSessionDocumentOrderAvailable({
        caseId: parentCaseId,
        courtSessionId: parentCaseCourtSessionId,
        isMergedDocumentOrder: true,
        reservedSlots: filedDocumentsInMergedCaseCount,
        courtDocumentId: undefined,
        transaction,
      })

      // update all merging court documents
      await this.courtDocumentModel.update(
        {
          mergedCourtSessionId: parentCaseCourtSessionId,
          mergedDocumentOrder: literal(`${nextOrder} + document_order - 1`),
        },
        {
          where: {
            caseId,
            courtSessionId: { [Op.ne]: null },
            documentOrder: { [Op.gt]: 0 },
          },
          transaction,
        },
      )
    } catch (error) {
      this.logger.error(
        `Error updating merged court document from ${caseId} to court session ${parentCaseCourtSessionId} of case ${parentCaseId}: `,
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

      // Make space for the next court session document
      const nextOrder = await this.makeNextCourtSessionDocumentOrderAvailable({
        caseId,
        courtSessionId,
        courtDocumentId,
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
        `Updated court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
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

      // Delete the document
      if (!documentToRemove.caseFileId && !documentToRemove.generatedPdfUri) {
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

  async deleteDocumentsInSession(
    caseId: string,
    courtSessionId: string,
    transaction: Transaction,
  ) {
    const filedDocuments = await this.courtDocumentModel.findAll({
      where: { caseId, courtSessionId },
      order: [['documentOrder', 'DESC']],
      transaction,
    })

    for (const f of filedDocuments) {
      await this.removeFromCourtSession(caseId, courtSessionId, f.id, {
        transaction,
      })
    }
  }

  private async makeNextCourtSessionDocumentOrderAvailable({
    caseId,
    courtSessionId,
    isMergedDocumentOrder,
    reservedSlots = 1,
    courtDocumentId,
    transaction,
  }: {
    caseId: string
    courtSessionId: string
    isMergedDocumentOrder?: boolean
    reservedSlots?: number
    courtDocumentId: string | undefined
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

      // for next order in file documents, we don't consider merged documents within the same court session
      if (!isMergedDocumentOrder && s.id === courtSessionId) {
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

      if (s.id === courtSessionId) {
        break
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
