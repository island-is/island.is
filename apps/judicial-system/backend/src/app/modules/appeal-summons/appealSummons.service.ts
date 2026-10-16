import { Transaction } from 'sequelize'

import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { MessageType } from '@island.is/judicial-system/message'

import {
  AppealCaseNotificationType,
  AppealEventType,
  AppealSummonsAction,
  AppealSummonsAppellantSide,
  canPerformAppealSummonsAction,
  type User,
} from '@island.is/judicial-system/types'

import { getCaseFileHash } from '../../formatters'
import { queueMessagesAfterCommit } from '../../middleware'
import { standingVerdictAppellants } from '../appeal-case'
import { AwsS3Service } from '../aws-s3'
import { PdfService } from '../case'
import {
  AppealEventLogRepositoryService,
  AppealSummons,
  AppealSummonsRepositoryService,
  Case,
} from '../repository'
import { CreateAppealSummonsDto } from './dto/createAppealSummons.dto'
import { PreviewAppealSummonsDto } from './dto/previewAppealSummons.dto'

@Injectable()
export class AppealSummonsService {
  constructor(
    private readonly appealSummonsRepositoryService: AppealSummonsRepositoryService,
    private readonly appealEventLogRepositoryService: AppealEventLogRepositoryService,
    private readonly pdfService: PdfService,
    private readonly awsS3Service: AwsS3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private appealSummonsPdfKey(caseId: string, summonsId: string): string {
    return `${caseId}/appealSummons/${summonsId}.pdf`
  }

  // Same key as pdf.service getAppealSummonsPdf. deleteObject already
  // tolerates a missing object the way case-file deletes do.
  private async tryDeleteCachedPdf(theCase: Case, summonsId: string) {
    await this.awsS3Service.deleteObject(
      theCase.type,
      this.appealSummonsPdfKey(theCase.id, summonsId),
    )
  }

  // Edit clears the hash then deletes S3 after commit. A confirmation that
  // lands between those steps would upload a new PDF and set a hash; skip the
  // delete so we do not remove that object.
  private async tryDeleteCachedPdfIfUnconfirmed(
    theCase: Case,
    summonsId: string,
  ) {
    const current = await this.appealSummonsRepositoryService.findByIdAndCaseId(
      summonsId,
      theCase.id,
    )

    if (current?.hash) {
      return
    }

    await this.tryDeleteCachedPdf(theCase, summonsId)
  }

  async create(
    theCase: Case,
    dto: CreateAppealSummonsDto,
    user: User,
    transaction: Transaction,
  ): Promise<AppealSummons> {
    const appealCase = theCase.verdictAppealCase

    if (!appealCase) {
      throw new BadRequestException(`Case ${theCase.id} has no verdict appeal`)
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
      !canPerformAppealSummonsAction(AppealSummonsAction.EDIT, summons, user)
    ) {
      throw new ForbiddenException(
        `User ${user.id} cannot edit appeal summons ${summons.id}`,
      )
    }

    const resolvedDefendants = this.resolveDefendants(theCase, dto, summons)

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
      // Delete after commit so a rolled-back edit cannot leave the DB hash
      // pointing at a PDF that S3 already removed. Re-check hash so a
      // confirmation that finished in between is not wiped. Catch cleanup
      // failures: the edit is already committed and must not fail the request.
      transaction.afterCommit(async () => {
        try {
          await this.tryDeleteCachedPdfIfUnconfirmed(theCase, summons.id)
        } catch (reason) {
          this.logger.error(
            `Failed to delete cached appeal summons PDF for ${summons.id} after edit`,
            { reason },
          )
        }
      })
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

  async delete(
    theCase: Case,
    summons: AppealSummons,
    user: User,
    transaction: Transaction,
  ): Promise<boolean> {
    if (
      !canPerformAppealSummonsAction(AppealSummonsAction.DELETE, summons, user)
    ) {
      throw new ForbiddenException(
        `User ${user.id} cannot delete appeal summons ${summons.id}`,
      )
    }

    const deleted = await this.appealSummonsRepositoryService.delete(
      summons.id,
      theCase.id,
      { transaction },
    )

    if (deleted) {
      // Same as update: only drop the cached PDF once the row is gone.
      transaction.afterCommit(async () => {
        try {
          await this.tryDeleteCachedPdf(theCase, summons.id)
        } catch (reason) {
          this.logger.error(
            `Failed to delete cached appeal summons PDF for ${summons.id} after delete`,
            { reason },
          )
        }
      })
    }

    return deleted
  }

  async confirm(
    theCase: Case,
    summons: AppealSummons,
    user: User,
    transaction: Transaction,
  ): Promise<AppealSummons> {
    if (
      !canPerformAppealSummonsAction(AppealSummonsAction.CONFIRM, summons, user)
    ) {
      throw new ForbiddenException(
        `User ${user.id} cannot confirm appeal summons ${summons.id}`,
      )
    }

    const appealCase = theCase.verdictAppealCase

    if (!appealCase) {
      throw new BadRequestException(`Case ${theCase.id} has no verdict appeal`)
    }

    const confirmedDate = new Date()

    await this.appealSummonsRepositoryService.update(
      summons.id,
      theCase.id,
      {
        confirmedById: user.id,
        confirmedDate,
      },
      { transaction },
    )

    const confirmed =
      await this.appealSummonsRepositoryService.findByIdAndCaseId(
        summons.id,
        theCase.id,
        { transaction },
      )

    if (!confirmed) {
      throw new BadRequestException(
        `Appeal summons ${summons.id} was not found after confirm`,
      )
    }

    const pdf = await this.pdfService.getAppealSummonsPdf(
      theCase,
      user,
      confirmed,
    )
    const { hash, hashAlgorithm } = getCaseFileHash(pdf)

    await this.appealSummonsRepositoryService.update(
      summons.id,
      theCase.id,
      { hash, hashAlgorithm },
      { transaction },
    )

    await this.appealEventLogRepositoryService.create(
      {
        caseId: theCase.id,
        appealCaseId: appealCase.id,
        eventType: AppealEventType.APPEAL_SUMMONS_CONFIRMED,
        userRole: user.role,
        userId: user.id,
        nationalId: user.nationalId,
        userName: user.name,
        userTitle: user.title,
        institutionName: user.institution?.name,
      },
      { transaction },
    )

    const result = await this.appealSummonsRepositoryService.findByIdAndCaseId(
      summons.id,
      theCase.id,
      { transaction },
    )

    if (!result) {
      throw new BadRequestException(
        `Appeal summons ${summons.id} was not found after hashing`,
      )
    }

    return result
  }

  async sendToCourtOfAppeals(
    theCase: Case,
    summons: AppealSummons,
    user: User,
    transaction: Transaction,
  ): Promise<AppealSummons> {
    if (
      !canPerformAppealSummonsAction(
        AppealSummonsAction.SEND_TO_COURT_OF_APPEALS,
        summons,
        user,
      )
    ) {
      throw new ForbiddenException(
        `User ${user.id} cannot send appeal summons ${summons.id} to the court of appeals`,
      )
    }

    const appealCase = theCase.verdictAppealCase

    if (!appealCase) {
      throw new BadRequestException(`Case ${theCase.id} has no verdict appeal`)
    }

    const sentToCourtOfAppealsDate = new Date()

    await this.appealSummonsRepositoryService.update(
      summons.id,
      theCase.id,
      { sentToCourtOfAppealsDate },
      { transaction },
    )

    await this.appealEventLogRepositoryService.create(
      {
        caseId: theCase.id,
        appealCaseId: appealCase.id,
        eventType: AppealEventType.APPEAL_SUMMONS_SENT_TO_COURT_OF_APPEALS,
        userRole: user.role,
        userId: user.id,
        nationalId: user.nationalId,
        userName: user.name,
        userTitle: user.title,
        institutionName: user.institution?.name,
      },
      { transaction },
    )

    queueMessagesAfterCommit({
      type: MessageType.APPEAL_CASE_NOTIFICATION,
      user,
      caseId: theCase.id,
      elementId: appealCase.id,
      body: {
        type: AppealCaseNotificationType.APPEAL_SUMMONS_SENT_TO_COURT_OF_APPEALS,
      },
    })

    const result = await this.appealSummonsRepositoryService.findByIdAndCaseId(
      summons.id,
      theCase.id,
      { transaction },
    )

    if (!result) {
      throw new BadRequestException(
        `Appeal summons ${summons.id} was not found after send to court of appeals`,
      )
    }

    return result
  }

  async resolvePreviewDefendants(
    theCase: Case,
    dto: PreviewAppealSummonsDto,
  ): Promise<
    {
      defendantId: string
      appellantSide: AppealSummonsAppellantSide
      claims: string
    }[]
  > {
    let existingSummons: AppealSummons | undefined

    if (dto.appealSummonsId) {
      const summons =
        await this.appealSummonsRepositoryService.findByIdAndCaseId(
          dto.appealSummonsId,
          theCase.id,
        )

      if (!summons) {
        throw new BadRequestException(
          `Appeal summons ${dto.appealSummonsId} not found for case ${theCase.id}`,
        )
      }

      existingSummons = summons
    }

    return this.resolveDefendants(theCase, dto, existingSummons)
  }

  resolveDefendants(
    theCase: Case,
    dto: Pick<CreateAppealSummonsDto, 'defendants'>,
    // On update/preview of an existing summons, defendants already on it may
    // be kept even if their appeal was later withdrawn.
    existingSummons?: Pick<AppealSummons, 'defendants'>,
  ): {
    defendantId: string
    appellantSide: AppealSummonsAppellantSide
    claims: string
  }[] {
    const appealCase = theCase.verdictAppealCase

    if (!appealCase) {
      throw new BadRequestException(`Case ${theCase.id} has no verdict appeal`)
    }

    const standing = standingVerdictAppellants(appealCase)
    const existingByDefendant = new Map(
      (existingSummons?.defendants ?? []).map((row) => [row.defendantId, row]),
    )
    const defendantIds = dto.defendants.map(
      (defendant) => defendant.defendantId,
    )

    if (new Set(defendantIds).size !== defendantIds.length) {
      throw new BadRequestException(
        'An appeal summons cannot include the same defendant twice',
      )
    }

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
        const existing = existingByDefendant.get(defendant.defendantId)

        if (!existing) {
          throw new BadRequestException(
            `Defendant ${defendant.defendantId} has no standing verdict appeal`,
          )
        }

        return {
          defendantId: defendant.defendantId,
          appellantSide: existing.appellantSide,
          claims: defendant.claims,
        }
      }

      const appellantSide =
        sides.length > 1 ||
        sides.includes(AppealSummonsAppellantSide.PROSECUTION)
          ? AppealSummonsAppellantSide.PROSECUTION
          : AppealSummonsAppellantSide.DEFENCE

      return {
        defendantId: defendant.defendantId,
        appellantSide,
        claims: defendant.claims,
      }
    })
  }
}
