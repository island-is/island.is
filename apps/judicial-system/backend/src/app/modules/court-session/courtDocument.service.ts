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

  create(
    caseId: string,
    createDto: CreateCourtDocument,
    transaction: Transaction,
  ): Promise<CourtDocument> {
    return this.courtDocumentRepositoryService.create(caseId, createDto, {
      transaction,
    })
  }

  createInCourtSession(
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

  update(
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

  updateMergedCourtDocuments({
    parentCaseId,
    parentCaseCourtSessionId,
    caseId,
    transaction,
  }: {
    parentCaseId: string
    parentCaseCourtSessionId: string
    caseId: string
    transaction: Transaction
  }): Promise<void> {
    return this.courtDocumentRepositoryService.updateMergedCourtDocuments({
      parentCaseId,
      parentCaseCourtSessionId,
      caseId,
      transaction,
    })
  }

  fileInCourtSession(
    caseId: string,
    courtDocumentId: string,
    fileDto: FileCourtDocumentInCourtSessionDto,
    transaction: Transaction,
  ): Promise<CourtDocument> {
    return this.courtDocumentRepositoryService.fileInCourtSession(
      caseId,
      fileDto.courtSessionId,
      courtDocumentId,
      { transaction },
    )
  }

  async delete(
    caseId: string,
    courtSessionId: string,
    courtDocumentId: string,
    transaction: Transaction,
  ): Promise<boolean> {
    await this.courtDocumentRepositoryService.removeFromCourtSession(
      caseId,
      courtSessionId,
      courtDocumentId,
      { transaction },
    )

    return true
  }
}
