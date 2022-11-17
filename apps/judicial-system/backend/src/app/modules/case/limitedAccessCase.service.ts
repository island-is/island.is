import { Op } from 'sequelize'

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import {
  CaseFileState,
  CaseState,
  UserRole,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { Defendant } from '../defendant'
import { Institution } from '../institution'
import { User } from '../user'
import { Case } from './models/case.model'
import { CaseFile } from '../file'

export const attributes: (keyof Case)[] = [
  'id',
  'created',
  'modified',
  'origin',
  'type',
  'indictmentSubType',
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

@Injectable()
export class LimitedAccessCaseService {
  constructor(@InjectModel(Case) private readonly caseModel: typeof Case) {}

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
        {
          model: CaseFile,
          as: 'caseFiles',
          required: false,
          where: {
            state: { [Op.not]: CaseFileState.DELETED },
            category: { [Op.not]: null },
          },
        },
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

    if (!theCase.seenByDefender) {
      await this.caseModel.update(
        { ...theCase, seenByDefender: nowFactory() },
        { where: { id: caseId } },
      )
    }

    return theCase
  }

  findDefenderNationalId(theCase: Case, nationalId: string): User {
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
