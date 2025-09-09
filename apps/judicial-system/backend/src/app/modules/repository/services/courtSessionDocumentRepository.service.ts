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

import { CourtSessionDocumentType } from '@island.is/judicial-system/types'

import { CourtSessionDocument } from '../models/courtSessionDocument.model'

interface CreateCourtSessionDocumentOptions {
  transaction?: Transaction
}

interface CreateCourtSessionDocument {
  documentType: CourtSessionDocumentType
  name: string
  caseFileId?: string
  generatedPdfUri?: string
}

interface UpdateCourtSessionDocumentOptions {
  transaction?: Transaction
}

interface DeleteCourtSessionDocumentOptions {
  transaction?: Transaction
}

interface UpdateCourtSessionDocument {
  documentOrder?: number
  name?: string
}

@Injectable()
export class CourtSessionDocumentRepositoryService {
  constructor(
    @InjectModel(CourtSessionDocument)
    private readonly courtSessionDocumentModel: typeof CourtSessionDocument,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    caseId: string,
    courtSessionId: string,
    data: CreateCourtSessionDocument,
    options?: CreateCourtSessionDocumentOptions,
  ): Promise<CourtSessionDocument> {
    try {
      this.logger.debug(
        `Creating a new court session document for court session ${courtSessionId} of case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const createOptions: CreateOptions = {}

      if (options?.transaction) {
        createOptions.transaction = options.transaction
      }

      // Find the document with the highest document order value for this case
      const lastDocument = await this.courtSessionDocumentModel.findOne({
        where: { caseId },
        order: [['documentOrder', 'DESC']],
        transaction: options?.transaction,
      })

      const nextOrder = lastDocument ? lastDocument.documentOrder + 1 : 1

      const courtSessionDocument = await this.courtSessionDocumentModel.create(
        { ...data, caseId, courtSessionId, documentOrder: nextOrder },
        createOptions,
      )

      this.logger.debug(
        `Created a new court session document ${courtSessionDocument.id} for court session ${courtSessionId} of case ${caseId}`,
      )

      return courtSessionDocument
    } catch (error) {
      this.logger.error(
        `Error creating a new court session document for court session ${courtSessionId} of case ${caseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }

  async update(
    caseId: string,
    courtSessionId: string,
    courtSessionDocumentId: string,
    data: UpdateCourtSessionDocument,
    options?: UpdateCourtSessionDocumentOptions,
  ): Promise<CourtSessionDocument> {
    try {
      this.logger.debug(
        `Updating court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const updateOptions: UpdateOptions = {
        where: { id: courtSessionDocumentId, caseId, courtSessionId },
      }

      if (options?.transaction) {
        updateOptions.transaction = options.transaction
      }

      // If the document order is being updated, we need special handling
      if (data.documentOrder !== undefined) {
        // Get the current document to check its current order
        const currentDocument = await this.courtSessionDocumentModel.findOne({
          where: { id: courtSessionDocumentId, caseId, courtSessionId },
          transaction: options?.transaction,
        })

        if (!currentDocument) {
          throw new InternalServerErrorException(
            `Could not find court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId}`,
          )
        }

        // Get the total count of documents for this case
        const totalDocuments = await this.courtSessionDocumentModel.count({
          where: { caseId },
          transaction: options?.transaction,
        })

        // Validate the document order bounds
        if (data.documentOrder < 1 || data.documentOrder > totalDocuments) {
          throw new BadRequestException(
            `Order must be between 1 and ${totalDocuments}`,
          )
        }

        const currentOrder = currentDocument.documentOrder
        const newOrder = data.documentOrder

        // Only adjust other documents if the document order is actually changing
        if (currentOrder !== newOrder) {
          if (newOrder > currentOrder) {
            // Moving down: decrease order of documents between current and new position
            await this.courtSessionDocumentModel.update(
              { documentOrder: literal('documentOrder - 1') },
              {
                where: {
                  caseId,
                  documentOrder: { [Op.gt]: currentOrder, [Op.lte]: newOrder },
                },
                transaction: options?.transaction,
              },
            )
          } else {
            // Moving up: increase order of documents between new and current position
            await this.courtSessionDocumentModel.update(
              { documentOrder: literal('documentOrder + 1') },
              {
                where: {
                  caseId,
                  documentOrder: { [Op.gte]: newOrder, [Op.lt]: currentOrder },
                },
                transaction: options?.transaction,
              },
            )
          }
        }
      }

      const [numberOfAffectedRows, courtSessionDocuments] =
        await this.courtSessionDocumentModel.update(data, {
          ...updateOptions,
          returning: true,
        })

      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId} with data:`,
          { data: Object.keys(data) },
        )
      }

      this.logger.debug(
        `Updated court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId}`,
      )

      return courtSessionDocuments[0]
    } catch (error) {
      this.logger.error(
        `Error updating court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }

  async delete(
    caseId: string,
    courtSessionId: string,
    courtSessionDocumentId: string,
    options?: DeleteCourtSessionDocumentOptions,
  ): Promise<void> {
    try {
      this.logger.debug(
        `Deleting court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId}`,
      )

      // Get the document to find its order before deletion
      const documentToDelete = await this.courtSessionDocumentModel.findOne({
        where: { id: courtSessionDocumentId, caseId, courtSessionId },
        transaction: options?.transaction,
      })

      if (!documentToDelete) {
        throw new InternalServerErrorException(
          `Could not find court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId}`,
        )
      }

      const deletedOrder = documentToDelete.documentOrder

      // Delete the document
      const numberOfDeletedRows = await this.courtSessionDocumentModel.destroy({
        where: { id: courtSessionDocumentId, caseId, courtSessionId },
        transaction: options?.transaction,
      })

      if (numberOfDeletedRows < 1) {
        throw new InternalServerErrorException(
          `Could not delete court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId}`,
        )
      }

      if (numberOfDeletedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfDeletedRows}) affected when deleting court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId}`,
        )
      }

      // Adjust order of remaining documents that had higher order values
      await this.courtSessionDocumentModel.update(
        { documentOrder: literal('documentOrder - 1') },
        {
          where: { caseId, documentOrder: { [Op.gt]: deletedOrder } },
          transaction: options?.transaction,
        },
      )

      this.logger.debug(
        `Deleted court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId} and adjusted remaining document orders`,
      )
    } catch (error) {
      this.logger.error(
        `Error deleting court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }
}
