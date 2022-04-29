import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import { CaseState, UserRole } from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { Defendant } from '../defendant'
import { Institution } from '../institution'
import { User } from '../user'
import { Case } from './models/case.model'

const attributes: (keyof Case)[] = [
  'id',
  'created',
  'modified',
  'origin',
  'type',
  'state',
  'policeCaseNumber',
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
]

@Injectable()
export class RestrictedCaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Case) private readonly caseModel: typeof Case,
  ) {}

  async findById(caseId: string): Promise<Case> {
    const theCase = await this.caseModel.findOne({
      attributes,
      include: [
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
      ],
      order: [[{ model: Defendant, as: 'defendants' }, 'created', 'ASC']],
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

  async findDefenderNationalId(
    theCase: Case,
    nationalId: string,
  ): Promise<User> {
    if (theCase.defenderNationalId !== nationalId) {
      throw new NotFoundException('Defendant not found')
    }

    const now = nowFactory()

    return {
      id: 'defender',
      created: now,
      modified: now,
      nationalId,
      name: theCase.defenderName ?? '',
      title: 'verjandi',
      mobileNumber: theCase.defenderPhoneNumber ?? '',
      email: theCase.defenderEmail ?? '',
      role: UserRole.DEFENDER,
      active: true,
    } as User
  }
}
