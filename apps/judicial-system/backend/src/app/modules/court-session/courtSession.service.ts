import { Transaction } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  CourtDocumentType,
  ServiceStatus,
} from '@island.is/judicial-system/types'

import {
  Case,
  CourtSession,
  CourtSessionRepositoryService,
  CourtSessionString,
} from '../repository'
import { CourtSessionStringDto } from './dto/CourtSessionStringDto.dto'
import { UpdateCourtSessionDto } from './dto/updateCourtSession.dto'
import { CourtDocumentService } from './courtDocument.service'

@Injectable()
export class CourtSessionService {
  constructor(
    private readonly courtSessionRepositoryService: CourtSessionRepositoryService,
    private readonly courtDocumentService: CourtDocumentService,
    @InjectModel(CourtSessionString)
    private readonly courtSessionStringModel: typeof CourtSessionString,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(theCase: Case, transaction: Transaction): Promise<CourtSession> {
    const courtSession = await this.courtSessionRepositoryService.create(
      theCase.id,
      { transaction },
    )

    // If this is not the first court session, then we are done
    if (theCase.courtSessions && theCase.courtSessions.length > 0) {
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
      const name = `Skjalaskrá ${policeCaseNumber}`

      await this.courtDocumentService.createInCourtSession(
        theCase.id,
        courtSession.id,
        {
          documentType: CourtDocumentType.GENERATED_DOCUMENT,
          name,
          generatedPdfUri: `/api/case/${theCase.id}/caseFilesRecord/${policeCaseNumber}/${name}`,
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

    for (const defendant of (theCase.defendants ?? []).filter(
      (defendant) => !defendant.isAlternativeService,
    )) {
      for (const subpoena of defendant.subpoenas ?? []) {
        const subpoenaName = `Fyrirkall ${defendant.name} ${formatDate(
          subpoena.created,
        )}`

        await this.courtDocumentService.createInCourtSession(
          theCase.id,
          courtSession.id,
          {
            documentType: CourtDocumentType.GENERATED_DOCUMENT,
            name: subpoenaName,
            generatedPdfUri: `/api/case/${theCase.id}/subpoena/${defendant.id}/${subpoena.id}/${subpoenaName}`,
          },
          transaction,
        )

        const wasSubpoenaSuccessfullyServed =
          subpoena.serviceStatus &&
          [
            ServiceStatus.DEFENDER,
            ServiceStatus.ELECTRONICALLY,
            ServiceStatus.IN_PERSON,
          ].includes(subpoena.serviceStatus)

        if (!wasSubpoenaSuccessfullyServed) {
          continue
        }

        const certificateName = `Birtingarvottorð ${defendant.name}`

        await this.courtDocumentService.createInCourtSession(
          theCase.id,
          courtSession.id,
          {
            documentType: CourtDocumentType.GENERATED_DOCUMENT,
            name: certificateName,
            generatedPdfUri: `/api/case/${theCase.id}/subpoenaServiceCertificate/${defendant.id}/${subpoena.id}/${certificateName}`,
          },
          transaction,
        )
      }
    }

    return courtSession
  }

  async createOrUpdateCourtSessionString({
    caseId,
    courtSessionId,
    mergedCaseId,
    update,
    transaction,
  }: {
    caseId: string
    courtSessionId: string
    mergedCaseId?: string
    update: CourtSessionStringDto
    transaction?: Transaction
  }): Promise<CourtSessionString> {
    const courtSessionString = await this.courtSessionStringModel.findOne({
      where: {
        caseId,
        courtSessionId,
        mergedCaseId,
        stringType: update.stringType,
      },
      transaction,
    })
    if (courtSessionString) {
      const [numberOfAffectedRows, courtSessionString] =
        await this.courtSessionStringModel.update(
          { value: update.value },
          {
            where: {
              caseId,
              courtSessionId,
              mergedCaseId,
              stringType: update.stringType,
            },
            transaction,
            returning: true,
          },
        )
      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update court session string for court session ${courtSessionId} of case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating court session string for court session ${courtSessionId} of case ${caseId} with data:`,
          { data: Object.keys({ value: update.value }) },
        )
      }

      this.logger.debug(
        `Updated court session string for court session ${courtSessionId} of case ${caseId}`,
      )
      return courtSessionString[0]
    } else {
      const courtSessionString = await this.courtSessionStringModel.create(
        {
          caseId,
          courtSessionId,
          mergedCaseId,
          stringType: update.stringType,
          value: update.value,
        },
        {
          transaction,
        },
      )
      return courtSessionString
    }
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
