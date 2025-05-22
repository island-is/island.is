import archiver from 'archiver'
import { Includeable, Op } from 'sequelize'
import { Writable } from 'stream'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import { MessageService, MessageType } from '@island.is/judicial-system/message'
import type { User as TUser } from '@island.is/judicial-system/types'
import {
  CaseAppealState,
  CaseFileCategory,
  CaseFileState,
  CaseNotificationType,
  CaseState,
  dateTypes,
  defendantEventTypes,
  eventTypes,
  isIndictmentCase,
  isRequestCase,
  stringTypes,
  UserRole,
} from '@island.is/judicial-system/types'

import { nowFactory, uuidFactory } from '../../factories'
import {
  CivilClaimant,
  CivilClaimantService,
  Defendant,
  DefendantEventLog,
  DefendantService,
} from '../defendant'
import { EventLog } from '../event-log'
import {
  CaseFile,
  FileService,
  getDefenceUserCaseFileCategories,
} from '../file'
import { IndictmentCount } from '../indictment-count'
import { Offense } from '../indictment-count/models/offense.model'
import { Institution } from '../institution'
import { Subpoena } from '../subpoena'
import { User } from '../user'
import { Victim } from '../victim'
import { Case } from './models/case.model'
import { CaseString } from './models/caseString.model'
import { DateLog } from './models/dateLog.model'
import { PdfService } from './pdf.service'

export const attributes: (keyof Case)[] = [
  'id',
  'created',
  'modified',
  'origin',
  'type',
  'indictmentSubtypes',
  'state',
  'policeCaseNumbers',
  'defenderName',
  'defenderNationalId',
  'defenderEmail',
  'defenderPhoneNumber',
  'requestSharedWithDefender',
  'courtId',
  'leadInvestigator',
  'requestedCustodyRestrictions',
  'prosecutorId',
  'courtCaseNumber',
  'courtEndTime',
  'decision',
  'validToDate',
  'isCustodyIsolation',
  'isolationToDate',
  'conclusion',
  'rulingDate',
  'rulingSignatureDate',
  'registrarId',
  'judgeId',
  'courtRecordSignatoryId',
  'courtRecordSignatureDate',
  'parentCaseId',
  'caseModifiedExplanation',
  'openedByDefender',
  'caseResentExplanation',
  'appealState',
  'accusedAppealDecision',
  'prosecutorAppealDecision',
  'accusedPostponedAppealDate',
  'prosecutorPostponedAppealDate',
  'prosecutorStatementDate',
  'defendantStatementDate',
  'appealCaseNumber',
  'appealAssistantId',
  'appealJudge1Id',
  'appealJudge2Id',
  'appealJudge3Id',
  'appealConclusion',
  'appealRulingDecision',
  'appealReceivedByCourtDate',
  'appealRulingModifiedHistory',
  'requestAppealRulingNotToBePublished',
  'prosecutorsOfficeId',
  'indictmentDecision',
  'indictmentRulingDecision',
  'indictmentHash',
  'courtSessionType',
  'indictmentReviewDecision',
  'indictmentReviewerId',
  'hasCivilClaims',
  'isCompletedWithoutRuling',
]

export interface LimitedAccessUpdateCase
  extends Pick<
    Case,
    | 'accusedPostponedAppealDate'
    | 'appealState'
    | 'defendantStatementDate'
    | 'openedByDefender'
    | 'appealRulingDecision'
  > {}

export const include: Includeable[] = [
  { model: Institution, as: 'prosecutorsOffice' },
  { model: Institution, as: 'court' },
  {
    model: User,
    as: 'prosecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'judge',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'registrar',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'courtRecordSignatory',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'appealAssistant',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'appealJudge1',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'appealJudge2',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'appealJudge3',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'indictmentReviewer',
    include: [{ model: Institution, as: 'institution' }],
  },
  { model: Case, as: 'parentCase', attributes },
  { model: Case, as: 'childCase', attributes },
  {
    model: Defendant,
    as: 'defendants',
    required: false,
    order: [['created', 'ASC']],
    include: [
      {
        model: Subpoena,
        as: 'subpoenas',
        required: false,
        order: [['created', 'DESC']],
        separate: true,
      },
      {
        model: DefendantEventLog,
        as: 'eventLogs',
        required: false,
        where: { eventType: defendantEventTypes },
        order: [['created', 'DESC']],
        separate: true,
      },
    ],
    separate: true,
  },
  {
    model: CivilClaimant,
    as: 'civilClaimants',
    required: false,
    order: [['created', 'ASC']],
    separate: true,
  },
  {
    model: Victim,
    as: 'victims',
    required: false,
  },
  {
    model: IndictmentCount,
    as: 'indictmentCounts',
    required: false,
    order: [['created', 'ASC']],
    include: [
      {
        model: Offense,
        as: 'offenses',
        required: false,
        order: [['created', 'ASC']],
        separate: true,
      },
    ],
    separate: true,
  },
  {
    model: CaseFile,
    as: 'caseFiles',
    required: false,
    order: [['created', 'DESC']],
    where: {
      state: { [Op.not]: CaseFileState.DELETED },
      category: [
        CaseFileCategory.RULING,
        CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
        CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
        CaseFileCategory.APPEAL_RULING,
        CaseFileCategory.APPEAL_COURT_RECORD,
        CaseFileCategory.COURT_RECORD,
        CaseFileCategory.CRIMINAL_RECORD,
        CaseFileCategory.CRIMINAL_RECORD_UPDATE,
        CaseFileCategory.COST_BREAKDOWN,
        CaseFileCategory.CASE_FILE,
        CaseFileCategory.PROSECUTOR_CASE_FILE,
        CaseFileCategory.DEFENDANT_CASE_FILE,
        CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
        CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
        CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
        CaseFileCategory.CIVIL_CLAIM,
        CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
      ],
    },
    separate: true,
  },
  {
    model: EventLog,
    as: 'eventLogs',
    required: false,
    where: { eventType: eventTypes },
    order: [['created', 'DESC']],
    separate: true,
  },
  {
    model: DateLog,
    as: 'dateLogs',
    required: false,
    where: { dateType: dateTypes },
    order: [['created', 'DESC']],
    separate: true,
  },
  {
    model: CaseString,
    as: 'caseStrings',
    required: false,
    where: { stringType: stringTypes },
    separate: true,
  },
  { model: Case, as: 'mergeCase', attributes },
  {
    model: Case,
    as: 'mergedCases',
    where: { state: CaseState.COMPLETED },
    include: [
      {
        model: CaseFile,
        as: 'caseFiles',
        required: false,
        where: {
          state: { [Op.not]: CaseFileState.DELETED },
          category: {
            [Op.in]: [
              CaseFileCategory.COURT_RECORD,
              CaseFileCategory.CRIMINAL_RECORD,
              CaseFileCategory.COST_BREAKDOWN,
              CaseFileCategory.CRIMINAL_RECORD_UPDATE,
              CaseFileCategory.CASE_FILE,
              CaseFileCategory.PROSECUTOR_CASE_FILE,
              CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
              CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
              CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
              CaseFileCategory.DEFENDANT_CASE_FILE,
              CaseFileCategory.CIVIL_CLAIM,
            ],
          },
        },
        separate: true,
      },
      { model: Institution, as: 'court' },
      { model: User, as: 'judge' },
      { model: Institution, as: 'prosecutorsOffice' },
    ],
    separate: true,
  },
]

@Injectable()
export class LimitedAccessCaseService {
  constructor(
    private readonly messageService: MessageService,
    private readonly defendantService: DefendantService,
    private readonly civilClaimantService: CivilClaimantService,
    private readonly pdfService: PdfService,
    private readonly fileService: FileService,
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(caseId: string): Promise<Case> {
    const theCase = await this.caseModel.findOne({
      attributes,
      include,
      where: {
        id: caseId,
        state: { [Op.not]: CaseState.DELETED },
        isArchived: false,
      },
    })

    if (!theCase) {
      throw new NotFoundException(`Case ${caseId} does not exist`)
    }

    return theCase
  }

  async update(
    theCase: Case,
    update: LimitedAccessUpdateCase,
    user: TUser,
  ): Promise<Case> {
    const [numberOfAffectedRows] = await this.caseModel.update(
      { ...update },
      { where: { id: theCase.id } },
    )

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating case ${theCase.id}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update case ${theCase.id}`,
      )
    }

    const messages = []

    if (update.appealState === CaseAppealState.APPEALED) {
      theCase.caseFiles
        ?.filter(
          (caseFile) =>
            caseFile.state === CaseFileState.STORED_IN_RVG &&
            caseFile.key &&
            caseFile.category &&
            [
              CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
              CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
            ].includes(caseFile.category),
        )
        .forEach((caseFile) => {
          const message = {
            type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
            user,
            caseId: theCase.id,
            elementId: caseFile.id,
          }
          messages.push(message)
        })

      messages.push({
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.APPEAL_TO_COURT_OF_APPEALS },
      })
    }

    if (update.appealState === CaseAppealState.WITHDRAWN) {
      messages.push({
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.APPEAL_WITHDRAWN },
      })
    }

    // Return limited access case
    const updatedCase = await this.findById(theCase.id)

    if (
      updatedCase.defendantStatementDate?.getTime() !==
      theCase.defendantStatementDate?.getTime()
    ) {
      messages.push({
        type: MessageType.NOTIFICATION,
        user,
        caseId: theCase.id,
        body: { type: CaseNotificationType.APPEAL_STATEMENT },
      })
    }

    if (messages.length > 0) {
      await this.messageService.sendMessagesToQueue(messages)
    }

    return updatedCase
  }

  private constructDefender(
    nationalId: string,
    name?: string,
    mobileNumber?: string,
    email?: string,
  ): User {
    const now = nowFactory()

    return {
      id: uuidFactory(),
      created: now,
      modified: now,
      nationalId,
      name: name ?? '',
      title: 'verjandi',
      mobileNumber: mobileNumber ?? '',
      email: email ?? '',
      role: UserRole.DEFENDER,
      active: true,
      canConfirmIndictment: false,
    } as User
  }

  async findDefenderByNationalId(nationalId: string): Promise<User> {
    return this.caseModel
      .findOne({
        where: {
          defenderNationalId: normalizeAndFormatNationalId(nationalId),
          state: { [Op.not]: CaseState.DELETED },
          isArchived: false,
        },
        order: [['created', 'DESC']],
      })
      .then((theCase) => {
        if (theCase) {
          // The national id is associated with a defender in a request case
          return this.constructDefender(
            nationalId,
            theCase.defenderName,
            theCase.defenderPhoneNumber,
            theCase.defenderEmail,
          )
        }

        return this.defendantService
          .findLatestDefendantByDefenderNationalId(nationalId)
          .then((defendant) => {
            if (defendant) {
              // The national id is associated with a defender in an indictment case
              return this.constructDefender(
                nationalId,
                defendant.defenderName,
                defendant.defenderPhoneNumber,
                defendant.defenderEmail,
              )
            }

            return this.civilClaimantService
              .findLatestClaimantBySpokespersonNationalId(nationalId)
              .then((civilClaimant) => {
                if (civilClaimant) {
                  // The national id is associated with a spokesperson for a civil claimant in an indictment case
                  return this.constructDefender(
                    nationalId,
                    civilClaimant.spokespersonName,
                    civilClaimant.spokespersonPhoneNumber,
                    civilClaimant.spokespersonEmail,
                  )
                }

                throw new NotFoundException('Defender not found')
              })
          })
      })
  }

  private zipFiles(files: { data: Buffer; name: string }[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const buffs: Buffer[] = []
      const converter = new Writable()

      converter._write = (chunk, _encoding, cb) => {
        buffs.push(chunk)
        process.nextTick(cb)
      }

      converter.on('finish', () => {
        resolve(Buffer.concat(buffs))
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

  async getAllFilesZip(theCase: Case, user: TUser): Promise<Buffer> {
    const allowedCaseFileCategories = getDefenceUserCaseFileCategories(
      user.nationalId,
      theCase.type,
      theCase.defendants,
      theCase.civilClaimants,
    )

    const allowedCaseFiles =
      theCase.caseFiles?.filter(
        (file) =>
          file.key &&
          file.category &&
          allowedCaseFileCategories.includes(file.category),
      ) ?? []

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

    if (
      isIndictmentCase(theCase.type) &&
      (Defendant.isConfirmedDefenderOfDefendantWithCaseFileAccess(
        user.nationalId,
        theCase.defendants,
      ) ||
        CivilClaimant.isConfirmedSpokespersonOfCivilClaimantWithCaseFileAccess(
          user.nationalId,
          theCase.civilClaimants,
        ))
    ) {
      promises.push(
        this.tryAddGeneratedPdfToFilesToZip(
          this.pdfService.getIndictmentPdf(theCase),
          'Ákæra.pdf',
          filesToZip,
        ),
      )

      theCase.policeCaseNumbers.forEach((policeCaseNumber) => {
        promises.push(
          this.tryAddGeneratedPdfToFilesToZip(
            this.pdfService.getCaseFilesRecordPdf(theCase, policeCaseNumber),
            `Skjalaskrá-${policeCaseNumber}.pdf`,
            filesToZip,
          ),
        )
      })

      theCase.defendants?.forEach((defendant) =>
        defendant.subpoenas?.forEach((subpoena) =>
          promises.push(
            this.tryAddGeneratedPdfToFilesToZip(
              this.pdfService.getSubpoenaPdf(theCase, defendant, subpoena),
              `Fyrirkall-${defendant.name}.pdf`,
              filesToZip,
            ),
          ),
        ),
      )
    }

    await Promise.all(promises)

    return this.zipFiles(filesToZip)
  }
}
