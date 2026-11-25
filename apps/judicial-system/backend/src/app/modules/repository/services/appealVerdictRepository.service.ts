import { Transaction, UpdateOptions } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  HashAlgorithm,
  ServiceRequirement,
  VerdictAppealDecision,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { AppealVerdict } from '../models/appealVerdict.model'

export type CreateAppealVerdict = {
  caseId: string
  appealCaseId: string
  defendantId: string
  serviceRequirement?: ServiceRequirement
  sentToServiceDate?: Date
}

export type UpdateAppealVerdict = {
  externalPoliceDocumentId?: string
  serviceRequirement?: ServiceRequirement | null
  sentToServiceDate?: Date | null
  serviceStatus?: VerdictServiceStatus
  serviceDate?: Date | null
  servedBy?: string
  comment?: string
  hash?: string
  hashAlgorithm?: HashAlgorithm
  appealDecision?: VerdictAppealDecision
  appealDate?: Date | null
  deliveredToDefenderNationalId?: string
}

export type RecordAppealVerdictServiceStatus = Omit<
  UpdateAppealVerdict,
  'externalPoliceDocumentId' | 'serviceRequirement' | 'sentToServiceDate'
>

@Injectable()
export class AppealVerdictRepositoryService {
  constructor(
    @InjectModel(AppealVerdict)
    private readonly appealVerdictModel: typeof AppealVerdict,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(
    appealVerdictId: string,
    options?: { transaction?: Transaction },
  ): Promise<AppealVerdict | null> {
    return this.appealVerdictModel.findOne({
      where: { id: appealVerdictId },
      transaction: options?.transaction,
    })
  }

  async findByIdForUpdate(
    appealVerdictId: string,
    options: { transaction: Transaction },
  ): Promise<AppealVerdict | null> {
    return this.appealVerdictModel.findOne({
      where: { id: appealVerdictId },
      transaction: options.transaction,
      lock: options.transaction.LOCK.UPDATE,
    })
  }

  async findByExternalPoliceDocumentId(
    externalPoliceDocumentId: string,
  ): Promise<AppealVerdict | null> {
    return this.appealVerdictModel.findOne({
      where: { externalPoliceDocumentId },
    })
  }

  async findByCaseId(
    caseId: string,
    options?: { transaction?: Transaction },
  ): Promise<AppealVerdict[]> {
    return this.appealVerdictModel.findAll({
      where: { caseId },
      order: [['created', 'ASC']],
      transaction: options?.transaction,
    })
  }

  async findByDefendantId(
    defendantId: string,
    options?: { transaction?: Transaction },
  ): Promise<AppealVerdict | null> {
    return this.appealVerdictModel.findOne({
      where: { defendantId },
      transaction: options?.transaction,
    })
  }

  async create(
    data: CreateAppealVerdict,
    options: { transaction: Transaction },
  ): Promise<AppealVerdict> {
    return this.appealVerdictModel.create(data, {
      transaction: options.transaction,
    })
  }

  async update(
    appealVerdictId: string,
    data: UpdateAppealVerdict,
    options: { transaction: Transaction },
  ): Promise<AppealVerdict> {
    const updateOptions: UpdateOptions = {
      where: { id: appealVerdictId },
      transaction: options.transaction,
    }

    const [affected, rows] = await this.appealVerdictModel.update(data, {
      ...updateOptions,
      returning: true,
    })

    if (affected === 0 || !rows?.[0]) {
      throw new InternalServerErrorException(
        `Failed to update appeal verdict ${appealVerdictId}`,
      )
    }

    return rows[0]
  }

  // Only applied while the row is still waiting for a status. A police push
  // that landed during a LOKE round-trip owns the row and is not overwritten.
  async recordServiceStatusIfUnset(
    appealVerdictId: string,
    data: RecordAppealVerdictServiceStatus,
    options: { transaction: Transaction },
  ): Promise<AppealVerdict | null> {
    const [affected, rows] = await this.appealVerdictModel.update(data, {
      where: {
        id: appealVerdictId,
        serviceStatus: null,
      },
      transaction: options.transaction,
      returning: true,
    })

    if (affected === 0) {
      return null
    }

    return rows[0] ?? null
  }
}
