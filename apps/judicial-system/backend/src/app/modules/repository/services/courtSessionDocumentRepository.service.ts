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

import { CourtSessionDocument } from '../models/courtSessionDocument.model'

interface CreateCourtSessionDocumentOptions {
  transaction?: Transaction
}

interface CreateCourtSessionDocument {
  documentType: string
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
  order?: number
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

      // Find the document with the highest order value for this case
      const lastDocument = await this.courtSessionDocumentModel.findOne({
        where: { caseId: caseId },
        order: [['order', 'DESC']],
        transaction: options?.transaction,
      })

      const nextOrder = lastDocument ? lastDocument.order + 1 : 1

      const courtSessionDocument = await this.courtSessionDocumentModel.create(
        { ...data, caseId, courtSessionId, order: nextOrder },
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
        where: { id: courtSessionDocumentId, caseId },
      }

      if (options?.transaction) {
        updateOptions.transaction = options.transaction
      }

      // If order is being updated, we need special handling
      if (data.order !== undefined) {
        // Get the current document to check its current order
        const currentDocument = await this.courtSessionDocumentModel.findOne({
          where: { id: courtSessionDocumentId, caseId },
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

        // Validate order bounds
        if (data.order < 1 || data.order > totalDocuments) {
          throw new BadRequestException(
            `Order must be between 1 and ${totalDocuments}`,
          )
        }

        const currentOrder = currentDocument.order
        const newOrder = data.order

        // Only adjust other documents if the order is actually changing
        if (currentOrder !== newOrder) {
          if (newOrder > currentOrder) {
            // Moving down: decrease order of documents between current and new position
            await this.courtSessionDocumentModel.update(
              { order: literal('order - 1') },
              {
                where: {
                  caseId,
                  order: { [Op.gt]: currentOrder, [Op.lte]: newOrder },
                },
                transaction: options?.transaction,
              },
            )
          } else {
            // Moving up: increase order of documents between new and current position
            await this.courtSessionDocumentModel.update(
              { order: literal('order + 1') },
              {
                where: {
                  caseId,
                  order: { [Op.gte]: newOrder, [Op.lt]: currentOrder },
                },
                transaction: options?.transaction,
              },
            )
          }
        }
      }

      // Update the document with the new data
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
        where: { id: courtSessionDocumentId, caseId },
        transaction: options?.transaction,
      })

      if (!documentToDelete) {
        throw new InternalServerErrorException(
          `Could not find court session document ${courtSessionDocumentId} for court session ${courtSessionId} of case ${caseId}`,
        )
      }

      const deletedOrder = documentToDelete.order

      // Delete the document
      const numberOfDeletedRows = await this.courtSessionDocumentModel.destroy({
        where: { id: courtSessionDocumentId, caseId },
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
        { order: literal('order - 1') },
        {
          where: { caseId, order: { [Op.gt]: deletedOrder } },
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
