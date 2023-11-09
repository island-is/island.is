import archiver from 'archiver'
import { Includeable, Op, OrderItem } from 'sequelize'
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

import {
  CaseMessage,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import type { User as TUser } from '@island.is/judicial-system/types'
import {
  CaseAppealState,
  CaseFileCategory,
  CaseFileState,
  CaseState,
  defenderCaseFileCategoriesForRestrictionAndInvestigationCases,
  UserRole,
} from '@island.is/judicial-system/types'

import { nowFactory, uuidFactory } from '../../factories'
import { AwsS3Service } from '../aws-s3'
import { Defendant, DefendantService } from '../defendant'
import { CaseFile } from '../file'
import { Institution } from '../institution'
import { User } from '../user'
import { Case } from './models/case.model'
import { PDFService } from './pdf.service'

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
  'creatingProsecutorId',
  'prosecutorId',
  'courtCaseNumber',
  'courtDate',
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
]

export interface LimitedAccessUpdateCase
  extends Pick<
    Case,
    | 'accusedPostponedAppealDate'
    | 'appealState'
    | 'defendantStatementDate'
    | 'openedByDefender'
  > {}

export const include: Includeable[] = [
  { model: Institution, as: 'court' },
  {
    model: User,
    as: 'creatingProsecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
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
  { model: Case, as: 'parentCase', attributes },
  { model: Case, as: 'childCase', attributes },
  { model: Defendant, as: 'defendants' },
  {
    model: CaseFile,
    as: 'caseFiles',
    required: false,
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
        CaseFileCategory.APPEAL_RULING,
        CaseFileCategory.COURT_RECORD,
        CaseFileCategory.COVER_LETTER,
        CaseFileCategory.INDICTMENT,
        CaseFileCategory.CRIMINAL_RECORD,
        CaseFileCategory.COST_BREAKDOWN,
        CaseFileCategory.CASE_FILE,
      ],
    },
  },
]

export const order: OrderItem[] = [
  [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
]

@Injectable()
export class LimitedAccessCaseService {
  constructor(
    private readonly messageService: MessageService,
    private readonly defendantService: DefendantService,
    private readonly pdfService: PDFService,
    private readonly awsS3Service: AwsS3Service,
    @InjectModel(Case) private readonly caseModel: typeof Case,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(caseId: string): Promise<Case> {
    const theCase = await this.caseModel.findOne({
      attributes,
      include,
      order,
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

    const messages: CaseMessage[] = []

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
            type: MessageType.DELIVER_CASE_FILE_TO_COURT,
            user,
            caseId: theCase.id,
            caseFileId: caseFile.id,
          }
          messages.push(message)
        })

      messages.push({
        type: MessageType.SEND_APPEAL_TO_COURT_OF_APPEALS_NOTIFICATION,
        user,
        caseId: theCase.id,
      })
    }

    // Return limited access case
    const updatedCase = await this.findById(theCase.id)

    if (
      updatedCase.defendantStatementDate?.getTime() !==
      theCase.defendantStatementDate?.getTime()
    ) {
      messages.push({
        type: MessageType.SEND_APPEAL_STATEMENT_NOTIFICATION,
        user,
        caseId: theCase.id,
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
    } as User
  }

  async findDefenderByNationalId(nationalId: string): Promise<User> {
    return this.caseModel
      .findOne({
        where: {
          defenderNationalId: nationalId,
          state: { [Op.not]: CaseState.DELETED },
          isArchived: false,
        },
        order: [['created', 'DESC']],
      })
      .then((theCase) => {
        if (theCase) {
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
              return this.constructDefender(
                nationalId,
                defendant.defenderName,
                defendant.defenderPhoneNumber,
                defendant.defenderEmail,
              )
            }

            throw new NotFoundException('Defender not found')
          })
      })
  }

  private zipFiles(
    files: Array<{ data: Buffer; name: string }>,
  ): Promise<Buffer> {
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

  async getAllFilesZip(theCase: Case, user: TUser): Promise<Buffer> {
    const filesToZip: Array<{ data: Buffer; name: string }> = []

    const caseFilesByCategory =
      theCase.caseFiles?.filter(
        (file) =>
          file.key &&
          file.category &&
          defenderCaseFileCategoriesForRestrictionAndInvestigationCases.includes(
            file.category,
          ),
      ) ?? []

    for (const file of caseFilesByCategory) {
      await this.awsS3Service
        .getObject(file.key ?? '')
        .then((content) => filesToZip.push({ data: content, name: file.name }))
        .catch((reason) =>
          // Tolerate failure, but log what happened
          this.logger.warn(
            `Could not get file ${file.id} of case ${file.caseId} from AWS S3`,
            { reason },
          ),
        )
    }

    filesToZip.push(
      {
        data: await this.pdfService.getRequestPdf(theCase),
        name: 'krafa.pdf',
      },
      {
        data: await this.pdfService.getCourtRecordPdf(theCase, user),
        name: 'þingbok.pdf',
      },
      {
        data: await this.pdfService.getRulingPdf(theCase),
        name: 'urskurður.pdf',
      },
    )

    return this.zipFiles(filesToZip)
  }
}
