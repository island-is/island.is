import addDays from 'date-fns/addDays'
import { Transaction } from 'sequelize'

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CaseState, isRequestCase } from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { DefendantService } from '../defendant'
import { FileService } from '../file'
import { IndictmentCountService } from '../indictment-count'
import {
  AppealCaseRepositoryService,
  AppealDecisionRepositoryService,
  Case,
  CaseArchiveRepositoryService,
  CaseRepositoryService,
  CaseStringRepositoryService,
  getRegularArchiveDate,
  UpdateAppealCase,
  UpdateCase,
  UpdateCaseFile,
  UpdateCaseString,
  UpdateDefendant,
} from '../repository'
import { CaseLifetimeResponse } from './models/caseLifetime.response'
import { buildCaseRestore, CaseArchiveMismatchError } from './caseArchive'

@Injectable()
export class CaseLifetimeService {
  constructor(
    @Inject(forwardRef(() => CaseRepositoryService))
    private readonly caseRepositoryService: CaseRepositoryService,
    @Inject(forwardRef(() => CaseArchiveRepositoryService))
    private readonly caseArchiveRepositoryService: CaseArchiveRepositoryService,
    @Inject(forwardRef(() => AppealCaseRepositoryService))
    private readonly appealCaseRepositoryService: AppealCaseRepositoryService,
    @Inject(forwardRef(() => AppealDecisionRepositoryService))
    private readonly appealDecisionRepositoryService: AppealDecisionRepositoryService,
    @Inject(forwardRef(() => CaseStringRepositoryService))
    private readonly caseStringRepositoryService: CaseStringRepositoryService,
    @Inject(forwardRef(() => DefendantService))
    private readonly defendantService: DefendantService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => IndictmentCountService))
    private readonly indictmentCountService: IndictmentCountService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // Writes the latest archive of an archived case back over the case and its
  // children, and returns the case properties left for the caller to write
  // together with the archived flag. The archive itself is kept: a case that
  // is archived again gets a new one, and the latest one is the one restored.
  private async restore(
    theCase: Case,
    transaction: Transaction,
  ): Promise<UpdateCase> {
    const caseArchive =
      await this.caseArchiveRepositoryService.findLatestByCaseId(theCase.id, {
        transaction,
      })

    if (!caseArchive) {
      throw new BadRequestException(
        `Case ${theCase.id} is archived but has no archive to restore`,
      )
    }

    if (!caseArchive.content) {
      throw new BadRequestException(
        `The archive of case ${theCase.id} cannot be decrypted`,
      )
    }

    let caseRestore
    try {
      caseRestore = buildCaseRestore(theCase, caseArchive.content)
    } catch (error) {
      if (error instanceof CaseArchiveMismatchError) {
        throw new BadRequestException(
          `The archive of case ${theCase.id} does not fit the case: ${error.message}`,
        )
      }

      throw error
    }

    if (caseRestore.appealCase) {
      await this.appealCaseRepositoryService.update(
        caseRestore.appealCase.id,
        caseRestore.appealCase.properties as UpdateAppealCase,
        { transaction },
      )
    }

    for (const defendant of caseRestore.defendants) {
      await this.defendantService.updateDatabaseDefendant(
        theCase.id,
        defendant.id,
        defendant.properties as UpdateDefendant,
        transaction,
      )
    }

    for (const caseFile of caseRestore.caseFiles) {
      // The keys come back as they were, so a file that has not expired from
      // storage yet is reachable again
      await this.fileService.updateCaseFile(
        theCase.id,
        caseFile.id,
        caseFile.properties as UpdateCaseFile,
        transaction,
      )
    }

    for (const indictmentCount of caseRestore.indictmentCounts) {
      await this.indictmentCountService.update(
        theCase.id,
        indictmentCount.id,
        indictmentCount.properties as Parameters<
          IndictmentCountService['update']
        >[2],
        transaction,
      )
    }

    for (const caseString of caseRestore.caseStrings) {
      await this.caseStringRepositoryService.updateByIdAndCase(
        caseString.id,
        theCase.id,
        caseString.properties as UpdateCaseString,
        { transaction },
      )
    }

    for (const appealDecision of caseRestore.appealDecisions) {
      await this.appealDecisionRepositoryService.update(
        appealDecision.id,
        appealDecision.properties as Parameters<
          AppealDecisionRepositoryService['update']
        >[1],
        { transaction },
      )
    }

    return caseRestore.caseProperties as UpdateCase
  }

  // Keeps a request case alive for the given number of days from today, past
  // its regular lifetime, restoring it first if it has already been archived.
  // Zero days removes an extension from a case that is not archived.
  async extend(
    caseId: string,
    days: number,
    transaction: Transaction,
  ): Promise<CaseLifetimeResponse> {
    const theCase =
      await this.caseRepositoryService.findWithArchiveGraphByIdForUpdate(
        caseId,
        transaction,
      )

    if (!theCase) {
      throw new NotFoundException(`Case ${caseId} does not exist`)
    }

    if (!isRequestCase(theCase.type)) {
      throw new BadRequestException(
        `Case ${caseId} is not a request case and has no lifetime to extend`,
      )
    }

    if (theCase.state === CaseState.DELETED) {
      throw new BadRequestException(
        `Case ${caseId} has been deleted and its lifetime cannot be extended`,
      )
    }

    if (days === 0) {
      if (theCase.isArchived) {
        throw new BadRequestException(
          `Case ${caseId} is archived and needs at least one day to be restored`,
        )
      }

      await this.caseRepositoryService.update(
        caseId,
        { archiveNotBefore: null },
        { transaction },
      )

      return { caseId, caseRestored: false }
    }

    const regularArchiveDate = getRegularArchiveDate(theCase)

    if (!regularArchiveDate) {
      throw new BadRequestException(
        `Case ${caseId} has no regular lifetime to extend`,
      )
    }

    const archiveNotBefore = addDays(nowFactory(), days)

    if (archiveNotBefore <= regularArchiveDate) {
      throw new BadRequestException(
        `The regular lifetime of case ${caseId} runs until ${regularArchiveDate.toISOString()}, which ${days} days from today does not extend`,
      )
    }

    const caseRestored = Boolean(theCase.isArchived)

    const restoredCaseProperties = caseRestored
      ? await this.restore(theCase, transaction)
      : {}

    await this.caseRepositoryService.update(
      caseId,
      { ...restoredCaseProperties, isArchived: false, archiveNotBefore },
      { transaction },
    )

    this.logger.info(
      `Case ${caseId} will not be archived before ${archiveNotBefore.toISOString()}${
        caseRestored ? ' and was restored from its archive' : ''
      }`,
    )

    return { caseId, archiveNotBefore, caseRestored }
  }
}
