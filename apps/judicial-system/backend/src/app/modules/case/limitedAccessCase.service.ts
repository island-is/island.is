import { Includeable, Op, OrderItem } from 'sequelize'

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import {
  CaseFileCategory,
  CaseFileState,
  CaseState,
  isIndictmentCase,
  UserRole,
} from '@island.is/judicial-system/types'

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
]

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
      category: CaseFileCategory.RULING,
    },
  },
]

export const order: OrderItem[] = [
  [{ model: Defendant, as: 'defendants' }, 'created', 'ASC'],
]

@Injectable()
export class LimitedAccessCaseService {
  constructor(@InjectModel(Case) private readonly caseModel: typeof Case) {}

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
