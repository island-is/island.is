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

  // The limited-access include loads a broad caseFiles allowlist; strip rows
  // the defence user may not see (including on merged/split cases) before the
  // payload leaves the service. Uses the same per-file rules as downloads /
  // LimitedAccessCaseFileInterceptor (category, submitter, cutoff, defendant,
  // confirmed ruling order). Merged-case downloads use the parent for access
  // control (LimitedAccessViewCaseFileGuard), and the merged include omits
  // sharing / appeal fields the filter needs — so merged files are judged
  // against the parent. Split cases own their defendant and files, so they
  // supply their own context.
  private restrictCaseFilesForDefenceUser(theCase: Case, user?: TUser): Case {
    if (!user || !isDefenceUser(user)) {
      return theCase
    }

    const keepAllowed = (file: CaseFile, caseContext: Case) =>
      canLimitedAccessUserViewCaseFile({
        user,
        caseType: caseContext.type,
        caseState: caseContext.state,
        submittedBy: file.submittedBy,
        fileRepresentative: file.fileRepresentative,
        caseFileCategory: file.category,
        defendants: caseContext.defendants,
        civilClaimants: caseContext.civilClaimants,
        defendantId: file.defendantId,
        fileCreated: file.created,
        civilClaimantId: file.civilClaimantId,
        isRulingOrderInConfirmedCourtSession:
          isRulingOrderInConfirmedCourtSession(
            file.id,
            caseContext.courtSessions,
          ),
      })

    if (theCase.caseFiles) {
      theCase.caseFiles = theCase.caseFiles.filter((file) =>
        keepAllowed(file, theCase),
      )
    }

    for (const merged of theCase.mergedCases ?? []) {
      if (merged.caseFiles) {
        merged.caseFiles = merged.caseFiles.filter((file) =>
          keepAllowed(file, theCase),
        )
      }
    }

    for (const split of theCase.splitCases ?? []) {
      if (split.caseFiles) {
        split.caseFiles = split.caseFiles.filter((file) =>
          keepAllowed(file, split),
        )
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

    const cutoffDate = getDefenceUserCutoffDate(
      user.nationalId,
      theCase.defendants,
      theCase.civilClaimants,
    )

    const allowedCaseFiles =
      theCase.caseFiles?.filter((file) => {
        if (!file.isKeyAccessible || !file.category) {
          return false
        }

        // A ruling order uploaded during the course of a case is only visible
        // once it has been added to a confirmed court session. One pronounced
        // orally has nothing to add to the zip until it has been written up.
        if (file.category === CaseFileCategory.COURT_INDICTMENT_RULING_ORDER) {
          return (
            !isRulingOrderWithoutDocument(file) &&
            isRulingOrderInConfirmedCourtSession(file.id, theCase.courtSessions)
          )
        }

        if (!allowedCaseFileCategories.includes(file.category)) {
          return false
        }

        if (cutoffDate && file.created > cutoffDate) {
          return false
        }

        if (
          (file.category === CaseFileCategory.CRIMINAL_RECORD ||
            file.category === CaseFileCategory.CRIMINAL_RECORD_UPDATE) &&
          file.defendantId
        ) {
          const defendant = theCase.defendants?.find(
            (d) => d.id === file.defendantId,
          )

          return (
            Defendant.isConfirmedDefenderOfSpecificDefendantWithCaseFileAccess(
              user.nationalId,
              file.defendantId,
              theCase.defendants,
            ) ||
            Defendant.isConfirmedAppealDefenderOfDefendant(
              user.nationalId,
              defendant ? [defendant] : undefined,
            )
          )
        }

        return true
      }) ?? []

    const promises: Promise<void>[] = []
    const filesToZip: { data: Buffer; name: string }[] = []

    allowedCaseFiles.forEach((file) => {
      promises.push(
        this.tryAddCaseFileFromS3ToFilesToZip(theCase, file, filesToZip),
      )
    })

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
