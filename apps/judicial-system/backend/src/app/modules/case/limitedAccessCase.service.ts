import { Includeable, Op, OrderItem } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  CaseFileCategory,
  CaseFileState,
  CaseState,
  isIndictmentCase,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User as TUser } from '@island.is/judicial-system/types'
import {
  CaseMessage,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'

import { nowFactory, uuidFactory } from '../../factories'
import { Defendant } from '../defendant'
import { Institution } from '../institution'
import { User } from '../user'
import { CaseFile } from '../file'
import { Case } from './models/case.model'

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
  'registrarId',
  'judgeId',
  'courtRecordSignatoryId',
  'courtRecordSignatureDate',
  'parentCaseId',
  'caseModifiedExplanation',
  'seenByDefender',
  'caseResentExplanation',
  'appealState',
  'accusedAppealDecision',
  'prosecutorAppealDecision',
  'accusedPostponedAppealDate',
  'prosecutorPostponedAppealDate',
]

export interface LimitedUpdateCase
  extends Pick<Case, 'accusedPostponedAppealDate' | 'appealState'> {}

export const include: Includeable[] = [
  { model: Defendant, as: 'defendants' },
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
  { model: Case, as: 'parentCase', attributes },
  { model: Case, as: 'childCase', attributes },
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

    if (!theCase.seenByDefender) {
      await this.caseModel.update(
        { ...theCase, seenByDefender: nowFactory() },
        { where: { id: caseId } },
      )
    }

    return theCase
  }

  async update(
    theCase: Case,
    update: LimitedUpdateCase,
    user: TUser,
  ): Promise<Case> {
    // Here we assume that the case is being appealed
    const [numberOfAffectedRows] = await this.caseModel.update(
      { ...update, accusedPostponedAppealDate: nowFactory() },
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

    // Here we assume that the case is being appealed
    const messages: CaseMessage[] =
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
        .map((caseFile) => ({
          type: MessageType.DELIVER_CASE_FILE_TO_COURT,
          user,
          caseId: theCase.id,
          caseFileId: caseFile.id,
        })) ?? []
    messages.push({
      type: MessageType.SEND_APPEAL_TO_COURT_OF_APPEALS_NOTIFICATION,
      user,
      caseId: theCase.id,
    })

    await this.messageService.sendMessagesToQueue(messages)

    // Return limited access case
    return await this.findById(theCase.id)
  }

  findDefenderNationalId(theCase: Case, nationalId: string): User {
    let defender:
      | {
          nationalId: string
          name?: string
          phoneNumber?: string
          email?: string
        }
      | undefined

    if (isIndictmentCase(theCase.type)) {
      const defendant = theCase.defendants?.find(
        (defendant) => defendant.defenderNationalId === nationalId,
      )

      if (defendant) {
        defender = {
          nationalId: defendant.defenderNationalId as string,
          name: defendant.defenderName,
          phoneNumber: defendant.defenderPhoneNumber,
          email: defendant.defenderEmail,
        }
      }
    } else if (theCase.defenderNationalId === nationalId) {
      defender = {
        nationalId: theCase.defenderNationalId,
        name: theCase.defenderName,
        phoneNumber: theCase.defenderPhoneNumber,
        email: theCase.defenderEmail,
      }
    }

    if (!defender) {
      throw new NotFoundException('Defender not found')
    }

    const now = nowFactory()

    return {
      id: uuidFactory(),
      created: now,
      modified: now,
      nationalId: defender.nationalId,
      name: defender.name ?? '',
      title: 'verjandi',
      mobileNumber: defender.phoneNumber ?? '',
      email: defender.email ?? '',
      role: UserRole.DEFENDER,
      active: true,
    } as User
  }
}
