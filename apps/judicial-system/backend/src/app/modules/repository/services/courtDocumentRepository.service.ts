import {
  CreateOptions,
  literal,
  Op,
  Transaction,
  UpdateOptions,
} from 'sequelize'

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
  transaction?: Transaction
}

export interface CreateCourtDocument {
  documentType: CourtDocumentType
  name: string
  caseFileId?: string
  generatedPdfUri?: string
}

interface UpdateCourtDocumentOptions {
  transaction?: Transaction
}

interface UpdateCourtDocument {
  documentOrder?: number
  name?: string
}

interface FileCourtDocumentInCourtSessionOptions {
  transaction?: Transaction
}

interface DeleteCourtDocumentOptions {
  transaction?: Transaction
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
    options?: CreateCourtDocumentOptions,
  ): Promise<CourtDocument> {
    try {
      this.logger.debug(
        `Creating a new court document of case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const createOptions: CreateOptions = {}

      if (options?.transaction) {
        createOptions.transaction = options.transaction
      }

      // Find the last court session for the case, if any
      const lastCourtSession = await this.courtSessionModel.findOne({
        where: { caseId },
        order: [['created', 'DESC']],
        transaction: options?.transaction,
      })

      const courtSessionId =
        lastCourtSession && !lastCourtSession.endDate
          ? lastCourtSession.id
          : undefined

      if (courtSessionId) {
        return this.createInCourtSession(caseId, courtSessionId, data, options)
      }

      const courtDocument = await this.courtDocumentModel.create(
        { ...data, caseId, documentOrder: 0 },
        createOptions,
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
    options?: CreateCourtDocumentOptions,
  ): Promise<CourtDocument> {
    try {
      this.logger.debug(
        `Creating a new court document for court session ${courtSessionId} of case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const createOptions: CreateOptions = {}

      if (options?.transaction) {
        createOptions.transaction = options.transaction
      }

      // Make space for the next court session document
      const nextOrder = await this.makeNextCourtSessionDocumentOrderAvailable(
        caseId,
        courtSessionId,
        undefined,
        options?.transaction,
      )

      const courtDocument = await this.courtDocumentModel.create(
        { ...data, caseId, courtSessionId, documentOrder: nextOrder },
        createOptions,
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

  async update(
    caseId: string,
    courtSessionId: string,
    courtDocumentId: string,
    data: UpdateCourtDocument,
    options?: UpdateCourtDocumentOptions,
  ): Promise<CourtDocument> {
    try {
      this.logger.debug(
        `Updating court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const updateOptions: UpdateOptions = {
        where: { id: courtDocumentId, caseId, courtSessionId },
      }

      if (options?.transaction) {
        updateOptions.transaction = options.transaction
      }

      // If the document order is being updated, we need special handling
      if (data.documentOrder !== undefined) {
        // Get the filed documents for the court session ordered by document order
        const filedDocuments = await this.courtDocumentModel.findAll({
          where: { caseId, courtSessionId },
          order: [['documentOrder', 'ASC']],
          transaction: options?.transaction,
        })

        const currentDocument = filedDocuments.find(
          (d) => d.id === courtDocumentId,
        )

        if (!currentDocument) {
          throw new InternalServerErrorException(
            `Could not find court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
          )
        }

        const newOrder = data.documentOrder
        const firstOrder = filedDocuments[0].documentOrder
        const lastOrder =
          filedDocuments[filedDocuments.length - 1].documentOrder

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
                transaction: options?.transaction,
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
                transaction: options?.transaction,
              },
            )
          }
        }
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

  async fileInCourtSession(
    caseId: string,
    courtDocumentId: string,
    courtSessionId: string,
    options?: FileCourtDocumentInCourtSessionOptions,
  ): Promise<CourtDocument> {
    try {
      this.logger.debug(
        `Filing court document ${courtDocumentId} in court session ${courtSessionId} of case ${caseId}`,
      )

      // Make space for the next court session document
      const nextOrder = await this.makeNextCourtSessionDocumentOrderAvailable(
        caseId,
        courtSessionId,
        courtDocumentId,
        options?.transaction,
      )

      const [numberOfAffectedRows, courtDocuments] =
        await this.courtDocumentModel.update(
          { courtSessionId, documentOrder: nextOrder },
          {
            where: { id: courtDocumentId, caseId },
            transaction: options?.transaction,
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

  async delete(
    caseId: string,
    courtSessionId: string,
    courtDocumentId: string,
    options?: DeleteCourtDocumentOptions,
  ): Promise<void> {
    try {
      this.logger.debug(
        `Deleting court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
      )

      // Get the document to find its order before deletion
      const documentToDelete = await this.courtDocumentModel.findOne({
        where: { id: courtDocumentId, caseId, courtSessionId },
        transaction: options?.transaction,
      })

      if (!documentToDelete) {
        throw new InternalServerErrorException(
          `Could not find court document ${courtDocumentId} for court session ${courtSessionId} of case ${caseId}`,
        )
      }

      const deletedOrder = documentToDelete.documentOrder

      // Delete the document
      if (!documentToDelete.caseFileId && !documentToDelete.generatedPdfUri) {
        await this.deleteFromDatabase(
          courtDocumentId,
          caseId,
          courtSessionId,
          options?.transaction,
        )
      } else {
        await this.courtDocumentModel.update(
          { courtSessionId: null, documentOrder: -1 },
          {
            where: { id: courtDocumentId, caseId, courtSessionId },
            transaction: options?.transaction,
          },
        )
      }

      // Adjust order of remaining documents that had higher order values
      await this.courtDocumentModel.update(
        { documentOrder: literal('document_order - 1') },
        {
          where: { caseId, documentOrder: { [Op.gt]: deletedOrder } },
          transaction: options?.transaction,
        },
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

  private async makeNextCourtSessionDocumentOrderAvailable(
    caseId: string,
    courtSessionId: string,
    courtDocumentId: string | undefined,
    transaction: Transaction | undefined,
  ) {
    // Get all court sessions and filed documents for the case
    const courtSessions = await this.courtSessionModel.findAll({
      where: { caseId },
      include: [{ model: CourtDocument, as: 'filedDocuments' }],
      order: [
        ['created', 'ASC'],
        ['filedDocuments', 'documentOrder', 'ASC'],
      ],
      transaction: transaction,
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
    }

    // Iincrease order of documents after the current position
    await this.courtDocumentModel.update(
      { documentOrder: literal('document_order + 1') },
      {
        where: {
          caseId,
          documentOrder: { [Op.gte]: nextOrder },
        },
        transaction: transaction,
      },
    )
    return nextOrder
  }

  private async deleteFromDatabase(
    courtDocumentId: string,
    caseId: string,
    courtSessionId: string,
    transaction: Transaction | undefined,
  ) {
    const numberOfDeletedRows = await this.courtDocumentModel.destroy({
      where: { id: courtDocumentId, caseId, courtSessionId },
      transaction: transaction,
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
