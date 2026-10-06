import { Transaction } from 'sequelize'

import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  AppealEventType,
  AppealSummonsAction,
  AppealSummonsAppellantSide,
  canPerformAppealSummonsAction,
  type User,
} from '@island.is/judicial-system/types'

import { standingVerdictAppellants } from '../appeal-case'
import {
  AppealEventLogRepositoryService,
  AppealSummons,
  AppealSummonsRepositoryService,
  Case,
} from '../repository'
import { CreateAppealSummonsDto } from './dto/createAppealSummons.dto'

@Injectable()
export class AppealSummonsService {
  constructor(
    private readonly appealSummonsRepositoryService: AppealSummonsRepositoryService,
    private readonly appealEventLogRepositoryService: AppealEventLogRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    theCase: Case,
    dto: CreateAppealSummonsDto,
    user: User,
    transaction: Transaction,
  ): Promise<AppealSummons> {
    const appealCase = theCase.verdictAppealCase

    if (!appealCase) {
      throw new BadRequestException(
        `Case ${theCase.id} has no verdict appeal`,
      )
    }

    this.logger.debug(
      `Creating an appeal summons for case ${theCase.id} and appeal case ${appealCase.id}`,
    )

    const resolvedDefendants = this.resolveDefendants(theCase, dto)

    const summons = await this.appealSummonsRepositoryService.create(
      { caseId: theCase.id, appealCaseId: appealCase.id },
      { transaction },
    )

    for (const defendant of resolvedDefendants) {
      await this.appealSummonsRepositoryService.createDefendant(
        {
          appealSummonsId: summons.id,
          defendantId: defendant.defendantId,
          appellantSide: defendant.appellantSide,
          claims: defendant.claims,
        },
        { transaction },
      )
    }

    await this.appealEventLogRepositoryService.create(
      {
        caseId: theCase.id,
        appealCaseId: appealCase.id,
        eventType: AppealEventType.APPEAL_SUMMONS_ISSUED,
        userRole: user.role,
        userId: user.id,
        nationalId: user.nationalId,
        userName: user.name,
        userTitle: user.title,
        institutionName: user.institution?.name,
      },
      { transaction },
    )

    const created = await this.appealSummonsRepositoryService.findByIdAndCaseId(
      summons.id,
      theCase.id,
      { transaction },
    )

    if (!created) {
      throw new BadRequestException(
        `Appeal summons ${summons.id} was not found after create`,
      )
    }

    return created
  }

  async update(
    theCase: Case,
    summons: AppealSummons,
    dto: CreateAppealSummonsDto,
    user: User,
    transaction: Transaction,
  ): Promise<AppealSummons> {
    if (
      !canPerformAppealSummonsAction(
        AppealSummonsAction.EDIT,
        summons,
        user,
      )
    ) {
      throw new ForbiddenException(
        `User ${user.id} cannot edit appeal summons ${summons.id}`,
      )
    }

    const resolvedDefendants = this.resolveDefendants(theCase, dto)

    if (summons.confirmedDate) {
      await this.appealSummonsRepositoryService.update(
        summons.id,
        theCase.id,
        {
          confirmedById: null,
          confirmedDate: null,
          hash: null,
          hashAlgorithm: null,
        },
        { transaction },
      )
    }

    await this.appealSummonsRepositoryService.deleteDefendants(summons.id, {
      transaction,
    })

    for (const defendant of resolvedDefendants) {
      await this.appealSummonsRepositoryService.createDefendant(
        {
          appealSummonsId: summons.id,
          defendantId: defendant.defendantId,
          appellantSide: defendant.appellantSide,
          claims: defendant.claims,
        },
        { transaction },
      )
    }

    const updated = await this.appealSummonsRepositoryService.findByIdAndCaseId(
      summons.id,
      theCase.id,
      { transaction },
    )

    if (!updated) {
      throw new BadRequestException(
        `Appeal summons ${summons.id} was not found after update`,
      )
    }

    return updated
  }

  private resolveDefendants(
    theCase: Case,
    dto: CreateAppealSummonsDto,
  ): {
    defendantId: string
    appellantSide: AppealSummonsAppellantSide
    claims: string
  }[] {
    const appealCase = theCase.verdictAppealCase

    if (!appealCase) {
      throw new BadRequestException(
        `Case ${theCase.id} has no verdict appeal`,
      )
    }

    const standing = standingVerdictAppellants(appealCase)

    return dto.defendants.map((defendant) => {
      const onCase = theCase.defendants?.some(
        (item) => item.id === defendant.defendantId,
      )

      if (!onCase) {
        throw new BadRequestException(
          `Defendant ${defendant.defendantId} is not on case ${theCase.id}`,
        )
      }

      const sides = standing
        .filter((appellant) => appellant.defendantId === defendant.defendantId)
        .map((appellant) => appellant.side)

      if (sides.length === 0) {
        throw new BadRequestException(
          `Defendant ${defendant.defendantId} has no standing verdict appeal`,
        )
      }

      const requested = defendant.appellantSide
      const appellantSide =
        sides.length === 1
          ? (sides[0] as AppealSummonsAppellantSide)
          : sides.includes(requested)
          ? requested
          : AppealSummonsAppellantSide.PROSECUTION

      return {
        defendantId: defendant.defendantId,
        appellantSide,
        claims: defendant.claims,
      }
    })
  }
}
