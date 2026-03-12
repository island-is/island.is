import { Transaction } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  Case,
  CourtSession,
  CourtSessionRepositoryService,
  CourtSessionString,
} from '../repository'
import { CourtSessionStringDto } from './dto/CourtSessionStringDto.dto'
import { UpdateCourtSessionDto } from './dto/updateCourtSession.dto'

@Injectable()
export class CourtSessionService {
  constructor(
    private readonly courtSessionRepositoryService: CourtSessionRepositoryService,
    // TODO: Move to a repository service - models should only be used in repository services
    // It would be best to hide the details of the court session model from all but the backend
    @InjectModel(CourtSessionString)
    private readonly courtSessionStringModel: typeof CourtSessionString,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  create(theCase: Case, transaction: Transaction): Promise<CourtSession> {
    return this.courtSessionRepositoryService.create(theCase.id, {
      transaction,
    })
  }

  async createOrUpdateCourtSessionString({
    caseId,
    courtSessionId,
    mergedCaseId,
    update,
    transaction,
  }: {
    caseId: string
    courtSessionId: string
    mergedCaseId?: string
    update: CourtSessionStringDto
    transaction?: Transaction
  }): Promise<CourtSessionString> {
    const courtSessionString = await this.courtSessionStringModel.findOne({
      where: {
        caseId,
        courtSessionId,
        mergedCaseId,
        stringType: update.stringType,
      },
      transaction,
    })
    if (courtSessionString) {
      const [numberOfAffectedRows, courtSessionString] =
        await this.courtSessionStringModel.update(
          { value: update.value },
          {
            where: {
              caseId,
              courtSessionId,
              mergedCaseId,
              stringType: update.stringType,
            },
            transaction,
            returning: true,
          },
        )
      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update court session string for court session ${courtSessionId} of case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating court session string for court session ${courtSessionId} of case ${caseId} with data:`,
          { data: Object.keys({ value: update.value }) },
        )
      }

      this.logger.debug(
        `Updated court session string for court session ${courtSessionId} of case ${caseId}`,
      )
      return courtSessionString[0]
    } else {
      const courtSessionString = await this.courtSessionStringModel.create(
        {
          caseId,
          courtSessionId,
          mergedCaseId,
          stringType: update.stringType,
          value: update.value,
        },
        {
          transaction,
        },
      )
      return courtSessionString
    }
  }

  update(
    caseId: string,
    courtSessionId: string,
    update: UpdateCourtSessionDto,
    transaction: Transaction,
  ): Promise<CourtSession> {
    return this.courtSessionRepositoryService.update(
      caseId,
      courtSessionId,
      update,
      { transaction },
    )
  }

  async delete(
    caseId: string,
    courtSessionId: string,
    transaction: Transaction,
  ): Promise<boolean> {
    await this.courtSessionRepositoryService.delete(caseId, courtSessionId, {
      transaction,
    })

    return true
  }
}
