import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseFileCategory,
  CourtDocumentType,
} from '@island.is/judicial-system/types'

import {
  Case,
  CourtSession,
  CourtSessionRepositoryService,
} from '../repository'
import { UpdateCourtSessionDto } from './dto/updateCourtSession.dto'
import { CourtDocumentService } from './courtDocument.service'

@Injectable()
export class CourtSessionService {
  constructor(
    private readonly courtSessionRepositoryService: CourtSessionRepositoryService,
    private readonly courtDocumentService: CourtDocumentService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(theCase: Case, transaction: Transaction): Promise<CourtSession> {
    const courtSession = await this.courtSessionRepositoryService.create(
      theCase.id,
      { transaction },
    )

    // If this is not the first court session, then we are done
    if (!theCase.courtSessions || theCase.courtSessions.length === 0) {
      return courtSession
    }

    // Start with the generated indictment PDF
    await this.courtDocumentService.createInCourtSession(
      theCase.id,
      courtSession.id,
      {
        documentType: CourtDocumentType.GENERATED_DOCUMENT,
        name: 'Ákæra',
        generatedPdfUri: `/api/case/${theCase.id}/indictment/Ákæra`,
      },
      transaction,
    )

    const caseFiles = theCase.caseFiles ?? []

    // Add all criminal records
    for (const caseFile of caseFiles.filter(
      (file) => file.category === CaseFileCategory.CRIMINAL_RECORD,
    ) ?? []) {
      await this.courtDocumentService.createInCourtSession(
        theCase.id,
        courtSession.id,
        {
          documentType: CourtDocumentType.UPLOADED_DOCUMENT,
          name: caseFile.userGeneratedFilename ?? caseFile.name,
          caseFileId: caseFile.id,
        },
        transaction,
      )
    }

    // Add all cost breakdowns
    for (const caseFile of caseFiles.filter(
      (file) => file.category === CaseFileCategory.COST_BREAKDOWN,
    ) ?? []) {
      await this.courtDocumentService.createInCourtSession(
        theCase.id,
        courtSession.id,
        {
          documentType: CourtDocumentType.UPLOADED_DOCUMENT,
          name: caseFile.userGeneratedFilename ?? caseFile.name,
          caseFileId: caseFile.id,
        },
        transaction,
      )
    }

    // Add all case files records
    for (const policeCaseNumber of theCase.policeCaseNumbers) {
      await this.courtDocumentService.createInCourtSession(
        theCase.id,
        courtSession.id,
        {
          documentType: CourtDocumentType.GENERATED_DOCUMENT,
          name: `Skjalaskrá ${policeCaseNumber}`,
          generatedPdfUri: `/api/case/${theCase.id}/caseFilesRecord/${policeCaseNumber}`,
        },
        transaction,
      )
    }

    // Add all remaining case files
    for (const caseFile of caseFiles?.filter(
      (file) =>
        file.category &&
        [
          CaseFileCategory.CASE_FILE,
          CaseFileCategory.PROSECUTOR_CASE_FILE,
          CaseFileCategory.DEFENDANT_CASE_FILE,
          CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIM,
        ].includes(file.category),
    ) ?? []) {
      await this.courtDocumentService.createInCourtSession(
        theCase.id,
        courtSession.id,
        {
          documentType: CourtDocumentType.UPLOADED_DOCUMENT,
          name: caseFile.userGeneratedFilename ?? caseFile.name,
          caseFileId: caseFile.id,
        },
        transaction,
      )
    }

    return courtSession
  }

  update(
    caseId: string,
    courtSessionId: string,
    update: UpdateCourtSessionDto,
    transaction?: Transaction,
  ): Promise<CourtSession> {
    return this.courtSessionRepositoryService.update(
      caseId,
      courtSessionId,
      update,
      { transaction },
    )
  }

  async delete(
    caseId: string,
    courtSessionId: string,
    transaction: Transaction,
  ): Promise<boolean> {
    await this.courtSessionRepositoryService.delete(caseId, courtSessionId, {
      transaction,
    })

    return true
  }
}
