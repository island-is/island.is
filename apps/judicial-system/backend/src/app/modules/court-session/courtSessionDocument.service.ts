import { Transaction } from 'sequelize'

import { Injectable } from '@nestjs/common'

import { CourtSessionDocumentType } from '@island.is/judicial-system/types'

import {
  CourtSessionDocument,
  CourtSessionDocumentRepositoryService,
} from '../repository'
import { CreateCourtSessionDocumentDto } from './dto/createCourtSessionDocument.dto'
import { UpdateCourtSessionDocumentDto } from './dto/updateCourtSessionDocument.dto'

@Injectable()
export class CourtSessionDocumentService {
  constructor(
    private readonly courtSessionDocumentRepositoryService: CourtSessionDocumentRepositoryService,
  ) {}

  async create(
    caseId: string,
    courtSessionId: string,
    createDto: CreateCourtSessionDocumentDto & {
      documentType: CourtSessionDocumentType
    },
    transaction: Transaction,
  ): Promise<CourtSessionDocument> {
    return this.courtSessionDocumentRepositoryService.create(
      caseId,
      courtSessionId,
      createDto,
      { transaction },
    )
  }

  async update(
    caseId: string,
    courtSessionId: string,
    courtSessionDocumentId: string,
    updateDto: UpdateCourtSessionDocumentDto,
    transaction: Transaction,
  ): Promise<CourtSessionDocument> {
    return this.courtSessionDocumentRepositoryService.update(
      caseId,
      courtSessionId,
      courtSessionDocumentId,
      updateDto,
      { transaction },
    )
  }

  async delete(
    caseId: string,
    courtSessionId: string,
    courtSessionDocumentId: string,
    transaction: Transaction,
  ): Promise<boolean> {
    await this.courtSessionDocumentRepositoryService.delete(
      caseId,
      courtSessionId,
      courtSessionDocumentId,
      { transaction },
    )

    return true
  }
}
