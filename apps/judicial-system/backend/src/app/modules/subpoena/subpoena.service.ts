import { Sequelize } from 'sequelize'

import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
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

@Injectable()
export class SubpoenaService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(Subpoena) private readonly subpoenaModel: typeof Subpoena,
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

  async updateSubpoena(
    subpoenaId: string,
    update: UpdateSubpoenaDto,
  ): Promise<Subpoena> {
    const [numberOfAffectedRows, subpoenas] = await this.subpoenaModel.update(
      update,
      {
        where: { subpoenaId },
        returning: true,
      },
    )

    if (numberOfAffectedRows < 1) {
      this.logger.error(
        `Unexpected number of rows ${numberOfAffectedRows} affected when updating subpoena`,
      )
    }
    return subpoenas[0]
  }

  async getSubpoena(subpoenaId: string): Promise<Subpoena | null> {
    return await this.subpoenaModel.findOne({ where: { subpoenaId } })
  }

  async getSubpoenas(defendant: Defendant): Promise<Subpoena[]> {
    return await this.subpoenaModel.findAll({
      where: { defendantId: defendant.id },
    })
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
        return Promise.resolve({ delivered: false })
      }

      await this.subpoenaModel.update(
        { subpoenaId: createdSubpoena.subpoenaId },
        { where: { id: subpoena.id } },
      )

      return Promise.resolve({ delivered: true })
    } catch (error) {
      this.logger.error('Error delivering subpoena to police', error)
      return { delivered: false }
    }
  }
}
