import { Transaction } from 'sequelize'

import { Injectable } from '@nestjs/common'

import { CourtDocument, CourtDocumentRepositoryService } from '../repository'
import { CreateCourtDocument } from '../repository/services/courtDocumentRepository.service'
import { FileCourtDocumentInCourtSessionDto } from './dto/fileCourtDocumentInCourtSession.dto'
import { UpdateCourtDocumentDto } from './dto/updateCourtDocument.dto'

@Injectable()
export class CourtDocumentService {
  constructor(
    private readonly courtDocumentRepositoryService: CourtDocumentRepositoryService,
  ) {}

  async create(
    caseId: string,
    createDto: CreateCourtDocument,
    transaction: Transaction,
  ): Promise<CourtDocument> {
    return this.courtDocumentRepositoryService.create(caseId, createDto, {
      transaction,
    })
  }

  async createInCourtSession(
    caseId: string,
    courtSessionId: string,
    createDto: CreateCourtDocument,
    transaction: Transaction,
  ): Promise<CourtDocument> {
    return this.courtDocumentRepositoryService.createInCourtSession(
      caseId,
      courtSessionId,
      createDto,
      { transaction },
    )
  }

  async update(
    caseId: string,
    courtSessionId: string,
    courtDocumentId: string,
    updateDto: UpdateCourtDocumentDto,
    transaction: Transaction,
  ): Promise<CourtDocument> {
    return this.courtDocumentRepositoryService.update(
      caseId,
      courtSessionId,
      courtDocumentId,
      updateDto,
      { transaction },
    )
  }

  async fileInCourtSession(
    caseId: string,
    courtDocumentId: string,
    fileDto: FileCourtDocumentInCourtSessionDto,
    transaction: Transaction,
  ): Promise<CourtDocument> {
    return this.courtDocumentRepositoryService.fileInCourtSession(
      caseId,
      courtDocumentId,
      fileDto.courtSessionId,
      { transaction },
    )
  }

  async delete(
    caseId: string,
    courtSessionId: string,
    courtDocumentId: string,
    transaction: Transaction,
  ): Promise<boolean> {
    await this.courtDocumentRepositoryService.delete(
      caseId,
      courtSessionId,
      courtDocumentId,
      { transaction },
    )

    return true
  }
}
