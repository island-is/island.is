import { Includeable, Sequelize } from 'sequelize'
import { Transaction } from 'sequelize/types'

import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import type { User } from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { Defendant } from '../defendant/models/defendant.model'
import { PoliceService } from '../police'
import { UpdateSubpoenaDto } from './dto/updateSubpoena.dto'
import { DeliverResponse } from './models/deliver.response'
import { Subpoena } from './models/subpoena.model'

export const include: Includeable[] = [
  { model: Case, as: 'case' },
  { model: Defendant, as: 'defendant' },
]
@Injectable()
export class SubpoenaService {
  constructor(
    @InjectModel(Subpoena) private readonly subpoenaModel: typeof Subpoena,
    @InjectModel(Defendant) private readonly defendantModel: typeof Defendant,
    @Inject(forwardRef(() => PoliceService))
    private readonly policeService: PoliceService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async createSubpoena(defendant: Defendant): Promise<Subpoena> {
    return await this.subpoenaModel.create({
      defendantId: defendant.id,
      caseId: defendant.caseId,
    })
  }

  async update(
    subpoena: Subpoena,
    update: UpdateSubpoenaDto,
    transaction?: Transaction,
  ): Promise<Subpoena> {
    const {
      defenderChoice,
      defenderNationalId,
      defenderEmail,
      defenderPhoneNumber,
      defenderName,
    } = update

    const [numberOfAffectedRows, subpoenas] = await this.subpoenaModel.update(
      update,
      {
        where: { subpoenaId: subpoena.subpoenaId },
        returning: true,
        transaction,
      },
    )

    if (numberOfAffectedRows < 1) {
      this.logger.error(
        `Unexpected number of rows ${numberOfAffectedRows} affected when updating subpoena`,
      )
    }

    if (defenderChoice || defenderNationalId) {
      const defendantUpdate: Partial<Defendant> = {
        defenderChoice,
        defenderNationalId,
        defenderName,
        defenderEmail,
        defenderPhoneNumber,
      }

      await this.defendantModel.update(defendantUpdate, {
        where: { id: subpoenas[0].defendantId },
        transaction,
      })
    }

    const updatedSubpoena = await this.findBySubpoenaId(subpoena.subpoenaId)
    return updatedSubpoena
  }

  async findBySubpoenaId(subpoenaId?: string): Promise<Subpoena> {
    if (!subpoenaId) {
      throw new Error('Missing subpoena id')
    }

    const subpoena = await this.subpoenaModel.findOne({
      include,
      where: { subpoenaId },
    })

    if (!subpoena) {
      throw new Error(`Subpoena with id ${subpoenaId} not found`)
    }

    return subpoena
  }

  async deliverSubpoenaToPolice(
    theCase: Case,
    defendant: Defendant,
    subpoenaFile: string,
    user: User,
  ): Promise<DeliverResponse> {
    try {
      const subpoena = await this.createSubpoena(defendant)

      const createdSubpoena = await this.policeService.createSubpoena(
        theCase,
        defendant,
        subpoenaFile,
        user,
      )

      if (!createdSubpoena) {
        this.logger.error('Failed to create subpoena file for police')
        return { delivered: false }
      }

      await this.subpoenaModel.update(
        { subpoenaId: createdSubpoena.subpoenaId },
        { where: { id: subpoena.id } },
      )

      return { delivered: true }
    } catch (error) {
      this.logger.error('Error delivering subpoena to police', error)
      return { delivered: false }
    }
  }
}
