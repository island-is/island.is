import archiver from 'archiver'
import { Transaction } from 'sequelize'
import { Writable } from 'stream'

import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import type { User as TUser } from '@island.is/judicial-system/types'
import {
  CaseFileCategory,
  hasGeneratedCourtRecordPdf,
  isDefenceUser,
  isIndictmentCase,
  isRequestCase,
  isRulingOrderWithoutDocument,
} from '@island.is/judicial-system/types'

import {
  canLimitedAccessUserViewCaseFile,
  FileService,
  getConfirmedDefendantsForDefender,
  getDefenceUserCaseFileCategories,
  getDefenceUserCutoffDate,
  getDefenceUserVisiblePoliceCaseNumbers,
  isRulingOrderInConfirmedCourtSession,
} from '../file'
import {
  Case,
  CaseFile,
  CaseRepositoryService,
  CivilClaimant,
  Defendant,
} from '../repository'
import { PdfService } from './pdf.service'

export type LimitedAccessUpdateCase = Pick<
  Case,
  | 'caseModifiedExplanation'
  | 'isolationToDate'
  | 'validToDate'
  | 'openedByDefender'
>

@Injectable()
export class LimitedAccessCaseService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly fileService: FileService,
    private readonly caseRepositoryService: CaseRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(
    caseId: string,
    options?: { transaction?: Transaction; user?: TUser },
  ): Promise<Case> {
    const defenceUserNationalId = this.defenceUserNationalId(options?.user)
    const theCase = await this.caseRepositoryService.findLimitedAccessById(
      caseId,
      {
        defenceUserNationalId,
        transaction: options?.transaction,
      },
    )

    if (!theCase) {
      throw new NotFoundException(`Case ${caseId} does not exist`)
    }

    return this.restrictCaseFilesForDefenceUser(theCase, options?.user)
  }

  /**
   * findById with the case row locked for the rest of the transaction. Used
   * by `LimitedAccessCaseExistsForUpdateGuard` so that a limited access route
   * that mutates decides against a case row no one else can change until it
   * commits. The user narrows the read exactly as in findById.
   */
  async findByIdForUpdate(
    caseId: string,
    transaction: Transaction,
    user?: TUser,
  ): Promise<Case> {
    const defenceUserNationalId = this.defenceUserNationalId(user)
    const theCase =
      await this.caseRepositoryService.findLimitedAccessByIdForUpdate(caseId, {
        defenceUserNationalId,
        transaction,
      })

    if (!theCase) {
      throw new NotFoundException(`Case ${caseId} does not exist`)
    }

    return this.restrictCaseFilesForDefenceUser(theCase, user)
  }

  // Only a defence user has their view of the linked cases narrowed
  private defenceUserNationalId(user?: TUser): string | undefined {
    return user && isDefenceUser(user) ? user.nationalId : undefined
  }

  // Case / merged / split caseFiles the defence user may see, each with the
  // owning case (for S3) and the access-control case. Same per-file rules as
  // downloads / LimitedAccessCaseFileInterceptor. Merged files are judged
  // against the parent (merged includes omit sharing / appeal fields); split
  // files against the split case.
  private getDefenceUserAccessibleCaseFiles(
    theCase: Case,
    user: TUser,
  ): { file: CaseFile; owningCase: Case }[] {
    const accessible: { file: CaseFile; owningCase: Case }[] = []

    const consider = (file: CaseFile, owningCase: Case, accessCase: Case) => {
      if (
        canLimitedAccessUserViewCaseFile({
          user,
          caseType: accessCase.type,
          caseState: accessCase.state,
          submittedBy: file.submittedBy,
          fileRepresentative: file.fileRepresentative,
          caseFileCategory: file.category,
          defendants: accessCase.defendants,
          civilClaimants: accessCase.civilClaimants,
          defendantId: file.defendantId,
          fileCreated: file.created,
          civilClaimantId: file.civilClaimantId,
          isRulingOrderInConfirmedCourtSession:
            isRulingOrderInConfirmedCourtSession(
              file.id,
              accessCase.courtSessions,
            ),
        })
      ) {
        accessible.push({ file, owningCase })
      }
    }

    for (const file of theCase.caseFiles ?? []) {
      consider(file, theCase, theCase)
    }

    for (const merged of theCase.mergedCases ?? []) {
      for (const file of merged.caseFiles ?? []) {
        consider(file, merged, theCase)
      }
    }

    for (const split of theCase.splitCases ?? []) {
      for (const file of split.caseFiles ?? []) {
        consider(file, split, split)
      }
    }

    return accessible
  }

  // Strip rows the defence user may not see before the limited-access payload
  // leaves the service.
  private restrictCaseFilesForDefenceUser(theCase: Case, user?: TUser): Case {
    if (!user || !isDefenceUser(user)) {
      return theCase
    }

    const filesByOwningCase = new Map<Case, CaseFile[]>()

    for (const { file, owningCase } of this.getDefenceUserAccessibleCaseFiles(
      theCase,
      user,
    )) {
      const files = filesByOwningCase.get(owningCase) ?? []
      files.push(file)
      filesByOwningCase.set(owningCase, files)
    }

    if (theCase.caseFiles) {
      theCase.caseFiles = filesByOwningCase.get(theCase) ?? []
    }

    for (const merged of theCase.mergedCases ?? []) {
      if (merged.caseFiles) {
        merged.caseFiles = filesByOwningCase.get(merged) ?? []
      }
    }

    for (const split of theCase.splitCases ?? []) {
      if (split.caseFiles) {
        split.caseFiles = filesByOwningCase.get(split) ?? []
      }
    }

    return theCase
  }

  async update(
    theCase: Case,
    update: LimitedAccessUpdateCase,
    user: TUser,
    transaction: Transaction,
  ): Promise<Case> {
    await this.caseRepositoryService.update(theCase.id, update, { transaction })

    // Return limited access case (read within transaction so we see the updated row)
    return this.findById(theCase.id, { transaction, user })
  }

  private zipFiles(files: { data: Buffer; name: string }[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const sinc: Uint8Array[] = []
      const converter = new Writable()

      converter._write = (chunk, _encoding, cb) => {
        sinc.push(chunk)
        process.nextTick(cb)
      }

      converter.on('finish', () => {
        resolve(Buffer.concat(sinc))
      })

      const archive = archiver('zip')

      archive.on('error', (err) => {
        reject(err)
      })

      archive.pipe(converter)

      for (const file of files) {
        archive.append(file.data, { name: file.name })
      }

      archive.finalize()
    })
  }

  private async tryAddFileToFilesToZip(
    bufferPromise: Promise<Buffer>,
    name: string,
    filesToZip: { data: Buffer; name: string }[] = [],
  ) {
    const data = await bufferPromise

    filesToZip.push({ data, name: name })
  }

  private async tryAddGeneratedPdfToFilesToZip(
    pdfPromise: Promise<Buffer>,
    name: string,
    filesToZip: { data: Buffer; name: string }[] = [],
  ) {
    try {
      await this.tryAddFileToFilesToZip(pdfPromise, name, filesToZip)
    } catch (error) {
      // Tolerate failure, but log what happened
      this.logger.warn(`Could not generate PDF ${name}`, { error })
    }
  }

  private async tryAddCaseFileFromS3ToFilesToZip(
    theCase: Case,
    file: CaseFile,
    filesToZip: { data: Buffer; name: string }[] = [],
  ) {
    try {
      await this.tryAddFileToFilesToZip(
        this.fileService.getCaseFileFromS3(theCase, file),
        file.name,
        filesToZip,
      )
    } catch (error) {
      // Tolerate failure, but log what happened
      this.logger.warn(
        `Could not get file ${file.id} of case ${file.caseId} from AWS S3`,
        { error },
      )
    }
  }

  async getAllFilesZip(
    theCase: Case,
    user: TUser,
    transaction: Transaction,
  ): Promise<Buffer> {
    const allowedCaseFileCategories = getDefenceUserCaseFileCategories(
      user.nationalId,
      theCase.type,
      theCase.defendants,
      theCase.civilClaimants,
    )

    const promises: Promise<void>[] = []
    const filesToZip: { data: Buffer; name: string }[] = []

    // Same visibility as the limited-access payload; skip oral ruling orders
    // with no document and keys we cannot fetch.
    for (const { file, owningCase } of this.getDefenceUserAccessibleCaseFiles(
      theCase,
      user,
    )) {
      if (!file.isKeyAccessible || isRulingOrderWithoutDocument(file)) {
        continue
      }

      promises.push(
        this.tryAddCaseFileFromS3ToFilesToZip(owningCase, file, filesToZip),
      )
    }

    if (isRequestCase(theCase.type)) {
      promises.push(
        this.tryAddGeneratedPdfToFilesToZip(
          this.pdfService.getRequestPdf(theCase),
          'Krafa.pdf',
          filesToZip,
        ),
        this.tryAddGeneratedPdfToFilesToZip(
          this.pdfService.getCourtRecordPdf(theCase, user),
          'Þingbók.pdf',
          filesToZip,
        ),
      )

      if (!theCase.isCompletedWithoutRuling) {
        promises.push(
          this.tryAddGeneratedPdfToFilesToZip(
            this.pdfService.getRulingPdf(theCase),
            'Úrskurður.pdf',
            filesToZip,
          ),
        )
      }
    }

    const hasIndictmentFileAccess =
      Defendant.isConfirmedDefenderOfDefendantWithCaseFileAccess(
        user.nationalId,
        theCase.defendants,
      ) ||
      CivilClaimant.isConfirmedSpokespersonOfCivilClaimantWithCaseFileAccess(
        user.nationalId,
        theCase.civilClaimants,
      ) ||
      Defendant.isConfirmedAppealDefenderOfDefendant(
        user.nationalId,
        theCase.defendants,
      ) ||
      CivilClaimant.isConfirmedAppealSpokespersonOfCivilClaimant(
        user.nationalId,
        theCase.civilClaimants,
      )

    if (isIndictmentCase(theCase.type) && hasIndictmentFileAccess) {
      promises.push(
        this.tryAddGeneratedPdfToFilesToZip(
          this.pdfService.getIndictmentPdf(theCase, transaction),
          'Ákæra.pdf',
          filesToZip,
        ),
      )

      const policeCaseNumbersForZip = getDefenceUserVisiblePoliceCaseNumbers(
        user.nationalId,
        theCase.defendants,
        theCase.civilClaimants,
        theCase.policeCaseNumbers,
      )

      policeCaseNumbersForZip.forEach((policeCaseNumber) => {
        promises.push(
          this.tryAddGeneratedPdfToFilesToZip(
            this.pdfService.getCaseFilesRecordPdf(theCase, policeCaseNumber),
            `Skjalaskrá-${policeCaseNumber}.pdf`,
            filesToZip,
          ),
        )
      })

      const myDefendantsById = new Map(
        getConfirmedDefendantsForDefender(
          user.nationalId,
          theCase.defendants,
        ).map((defendant) => [defendant.id, defendant]),
      )

      for (const defendant of theCase.defendants ?? []) {
        if (
          Defendant.isConfirmedAppealDefenderOfDefendant(user.nationalId, [
            defendant,
          ])
        ) {
          myDefendantsById.set(defendant.id, defendant)
        }
      }

      const myDefendants = [...myDefendantsById.values()]

      myDefendants.forEach((defendant) =>
        defendant.subpoenas?.forEach((subpoena) =>
          promises.push(
            this.tryAddGeneratedPdfToFilesToZip(
              this.pdfService.getSubpoenaPdf(
                theCase,
                defendant,
                transaction,
                subpoena,
              ),
              `Fyrirkall-${defendant.name}.pdf`,
              filesToZip,
            ),
          ),
        ),
      )

      const allMyDefendantsDismissed = Boolean(
        getDefenceUserCutoffDate(
          user.nationalId,
          theCase.defendants,
          theCase.civilClaimants,
        ),
      )

      const shouldIncludeGeneratedCourtRecord =
        allowedCaseFileCategories.includes(CaseFileCategory.COURT_RECORD) &&
        !theCase.caseFiles?.some(
          (file) => file.category === CaseFileCategory.COURT_RECORD,
        ) &&
        !allMyDefendantsDismissed &&
        hasGeneratedCourtRecordPdf(
          theCase.state,
          theCase.indictmentRulingDecision,
          theCase.withCourtSessions,
          theCase.courtSessions,
          user,
        )

      if (shouldIncludeGeneratedCourtRecord) {
        promises.push(
          this.tryAddGeneratedPdfToFilesToZip(
            this.pdfService.getCourtRecordPdfForIndictmentCase(
              theCase,
              user,
              transaction,
            ),
            'Þingbók.pdf',
            filesToZip,
          ),
        )
      }
    }

    await Promise.all(promises)

    return this.zipFiles(filesToZip)
  }
}
