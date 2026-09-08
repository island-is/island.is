import pick from 'lodash/pick'
import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { Inject, Injectable } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseFileCategory,
  CaseState,
  CaseType,
  DateType,
  EventType,
  IndictmentDecision,
  StringType,
} from '@island.is/judicial-system/types'

import { AwsS3Service } from '../aws-s3'
import {
  Case,
  CaseDefendantPoliceCaseNumberRepositoryService,
  CaseFileRepositoryService,
  CaseRepositoryService,
  CaseStringRepositoryService,
  CivilClaimantRepositoryService,
  DateLogRepositoryService,
  DefendantEventLogRepositoryService,
  DefendantRepositoryService,
  EventLogRepositoryService,
  IndictmentCountRepositoryService,
  OffenseRepositoryService,
  SubpoenaRepositoryService,
  VerdictRepositoryService,
  VictimRepositoryService,
} from '../repository'

interface DuplicateCaseOptions {
  transaction: Transaction
  // The prosecutor that owns the new draft case
  prosecutorId?: string
  prosecutorsOfficeId?: string
}

interface SplitCaseOptions {
  transaction: Transaction
}

// Only data entered by the prosecution is copied - no court data. The new
// draft keeps a parentCaseId link to the original so that communication
// with the police system (LÖKE) resolves to the original ancestor case
// (see CaseRepositoryService.findOriginalAncestorId).
const prosecutorFieldsToCopy: (keyof Case)[] = [
  'origin',
  'type',
  'indictmentSubtypes',
  'description',
  'crimeScenes',
  'courtId',
  'comments',
  'indictmentIntroduction',
  'requestDriversLicenseSuspension',
  'hasCivilClaims',
]

// The prosecutor entered case strings. Other string types are court/process
// data.
const caseStringTypesToCopy = [StringType.CIVIL_DEMANDS, StringType.PENALTIES]

// The case files uploaded by the prosecution.
const caseFileCategoriesToCopy = [
  CaseFileCategory.CRIMINAL_RECORD,
  CaseFileCategory.COST_BREAKDOWN,
  CaseFileCategory.CASE_FILE,
  CaseFileCategory.CASE_FILE_RECORD,
  CaseFileCategory.PROSECUTOR_CASE_FILE,
  CaseFileCategory.DEFENDANT_CASE_FILE,
  CaseFileCategory.CIVIL_CLAIM,
  CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
  CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
  CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
]

// A split case is the court's case for one defendant, so it takes the court's
// view of the case it came from: the prosecution's fields and the court's
// assignments and decisions so far.
const splitFieldsToCopy: (keyof Case)[] = [
  'origin',
  'type',
  'indictmentSubtypes',
  'description',
  'courtId',
  'demands',
  'comments',
  'creatingProsecutorId',
  'prosecutorId',
  'courtEndTime',
  'rulingDate',
  'registrarId',
  'judgeId',
  'rulingModifiedHistory',
  'openedByDefender',
  'crimeScenes',
  'indictmentIntroduction',
  'requestDriversLicenseSuspension',
  'prosecutorsOfficeId',
  'indictmentDeniedExplanation',
  'indictmentHash',
  'hasCivilClaims',
]

// The civil demands apply to every defendant of the indictment, so the split
// case gets its own copy. The other case strings are court/process data.
const splitCaseStringTypesToCopy = [StringType.CIVIL_DEMANDS]

// The split case keeps the arraignment date of the case it came from.
const splitDateTypesToCopy = [DateType.ARRAIGNMENT_DATE]

// The events that record how the indictment reached the court.
const splitEventTypesToCopy = [
  EventType.INDICTMENT_CONFIRMED,
  EventType.CASE_SENT_TO_COURT,
  EventType.CASE_RECEIVED_BY_COURT,
]

// The case files a defendant takes along when split off, and, for the files
// linked to no defendant, the ones both cases need.
const splitCaseFileCategories = [
  CaseFileCategory.CRIMINAL_RECORD,
  CaseFileCategory.COST_BREAKDOWN,
  CaseFileCategory.CASE_FILE,
  CaseFileCategory.PROSECUTOR_CASE_FILE,
  CaseFileCategory.DEFENDANT_CASE_FILE,
  CaseFileCategory.CIVIL_CLAIM,
  CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
  CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
  CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
]

// Copies a case's object graph - the case row, its defendants, indictment
// counts and offenses, victims, case strings, civil claimants and case files -
// into a new case, with variations: a duplicate copies everything the
// prosecution entered, a split moves one defendant and what hangs off them and
// copies what the two cases share. The per-model copies and moves live in the
// repositories; this service owns the order, the id remapping between them and
// the S3 objects behind the case files.
@Injectable()
export class CaseCloningService {
  constructor(
    private readonly caseRepositoryService: CaseRepositoryService,
    private readonly caseDefendantPoliceCaseNumberRepositoryService: CaseDefendantPoliceCaseNumberRepositoryService,
    private readonly defendantRepositoryService: DefendantRepositoryService,
    private readonly subpoenaRepositoryService: SubpoenaRepositoryService,
    private readonly verdictRepositoryService: VerdictRepositoryService,
    private readonly defendantEventLogRepositoryService: DefendantEventLogRepositoryService,
    private readonly indictmentCountRepositoryService: IndictmentCountRepositoryService,
    private readonly offenseRepositoryService: OffenseRepositoryService,
    private readonly victimRepositoryService: VictimRepositoryService,
    private readonly caseStringRepositoryService: CaseStringRepositoryService,
    private readonly dateLogRepositoryService: DateLogRepositoryService,
    private readonly eventLogRepositoryService: EventLogRepositoryService,
    private readonly civilClaimantRepositoryService: CivilClaimantRepositoryService,
    private readonly caseFileRepositoryService: CaseFileRepositoryService,
    private readonly awsS3Service: AwsS3Service,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // Recreates the per-defendant police case number assignments against the
  // copies of the defendants
  private async copyDefendantPoliceCaseNumberAssignments(
    caseId: string,
    newCaseId: string,
    defendantIdMap: ReadonlyMap<string, string>,
    transaction: Transaction,
  ): Promise<void> {
    const assignedLinks =
      await this.caseDefendantPoliceCaseNumberRepositoryService.findAssignedLinksByCaseId(
        caseId,
        { transaction },
      )

    const newAssignedLinks = assignedLinks
      .map((link) => ({
        defendantId: defendantIdMap.get(link.defendantId),
        policeCaseNumber: link.policeCaseNumber,
      }))
      .filter(
        (link): link is { defendantId: string; policeCaseNumber: string } =>
          Boolean(link.defendantId),
      )

    await this.caseDefendantPoliceCaseNumberRepositoryService.assignDefendantPoliceCaseNumbers(
      newCaseId,
      newAssignedLinks,
      { transaction },
    )
  }

  // Copies the prosecutor uploaded case files to the new case. The new case is
  // fully independent, so each S3 object is copied to a new key rather than
  // shared. A file whose object cannot be copied is skipped, not fatal.
  private async copyProsecutorCaseFiles(
    caseId: string,
    newCaseId: string,
    defendantIdMap: ReadonlyMap<string, string>,
    civilClaimantIdMap: ReadonlyMap<string, string>,
    transaction: Transaction,
  ): Promise<void> {
    const filesToCopy =
      await this.caseFileRepositoryService.findAllByCaseAndCategories(
        caseId,
        caseFileCategoriesToCopy,
        { transaction },
      )

    for (const file of filesToCopy) {
      // Files without an accessible S3 object cannot be copied
      if (!file.isKeyAccessible || !file.key) {
        continue
      }

      // The key is `${caseId}/${uuid}/${filename}` - keep the filename but
      // point the object at the new case under a fresh uuid
      const filename = file.key.split('/').slice(2).join('/')
      const newKey = `${newCaseId}/${uuid()}/${filename}`

      try {
        await this.awsS3Service.copyObject(
          CaseType.INDICTMENT,
          file.key,
          newKey,
        )
      } catch (error) {
        // Tolerate failure of a single file, but log error and skip it
        this.logger.error(`Failed to copy S3 object for case file ${file.id}`, {
          error,
        })

        continue
      }

      await this.caseFileRepositoryService.copyToCase(
        file,
        newCaseId,
        {
          key: newKey,
          defendantId: file.defendantId
            ? defendantIdMap.get(file.defendantId)
            : undefined,
          civilClaimantId: file.civilClaimantId
            ? civilClaimantIdMap.get(file.civilClaimantId)
            : undefined,
        },
        { transaction },
      )
    }
  }

  // The case to duplicate is the one the route already resolved and decided
  // from, rather than an id read again here. Re-reading it would buy no
  // consistency with the copies below - they run at READ COMMITTED, so each
  // statement takes its own snapshot either way - and it would let the
  // eligibility decision and the copied data come from two different reads.
  async duplicateIndictmentToDraft(
    caseToDuplicate: Case,
    options: DuplicateCaseOptions,
  ): Promise<Case> {
    const caseId = caseToDuplicate.id

    try {
      this.logger.debug(
        `Duplicating indictment case ${caseId} into a new draft case`,
      )

      const { transaction, prosecutorId, prosecutorsOfficeId } = options

      // Maintain the connection to the police system by seeding all police
      // case numbers of the original as unassigned rows on the new case
      const policeCaseNumbersMap =
        await this.caseDefendantPoliceCaseNumberRepositoryService.findDistinctPoliceCaseNumbersByCaseIds(
          [caseId],
          { transaction },
        )

      // Create the new draft case
      const result = await this.caseRepositoryService.create(
        {
          ...pick(caseToDuplicate, prosecutorFieldsToCopy),
          state: CaseState.DRAFT,
          // Keep the link to the original case so the original ancestor can be
          // resolved for police system (LÖKE) communication
          parentCaseId: caseId,
          // The new case should have court session support
          withCourtSessions: true,
          // The current prosecutor owns the new draft case
          creatingProsecutorId: prosecutorId,
          prosecutorId,
          prosecutorsOfficeId,
          policeCaseNumbers: policeCaseNumbersMap.get(caseId) ?? [],
        },
        { transaction },
      )

      const { id: newCaseId } = result

      // Copy the defendants (prosecutor entered data only), keeping a map from
      // the original defendant ids to the new ones for remapping the
      // references that point at defendants
      const defendantIdMap =
        await this.defendantRepositoryService.copyProsecutorEnteredToCase(
          caseId,
          newCaseId,
          { transaction },
        )

      await this.copyDefendantPoliceCaseNumberAssignments(
        caseId,
        newCaseId,
        defendantIdMap,
        transaction,
      )

      // Copy all indictment counts and their offenses to the new case
      const indictmentCountIdMap =
        await this.indictmentCountRepositoryService.copyAllToCase(
          caseId,
          newCaseId,
          { transaction },
        )

      await this.offenseRepositoryService.copyAllForIndictmentCounts(
        indictmentCountIdMap,
        { transaction },
      )

      await this.victimRepositoryService.copyAllToCase(caseId, newCaseId, {
        transaction,
      })

      await this.caseStringRepositoryService.copyByTypesToCase(
        caseId,
        newCaseId,
        caseStringTypesToCopy,
        { transaction },
      )

      // Copy all civil claimants, remapping their defendant references, and
      // keep a map from the original civil claimant ids to the new ones for
      // remapping the case files that point at civil claimants
      const civilClaimantIdMap =
        await this.civilClaimantRepositoryService.copyAllToCase(
          caseId,
          newCaseId,
          defendantIdMap,
          { transaction },
        )

      await this.copyProsecutorCaseFiles(
        caseId,
        newCaseId,
        defendantIdMap,
        civilClaimantIdMap,
        transaction,
      )

      // The police case numbers are not resolved again here: create already
      // resolved them onto this instance, and nothing since can have changed
      // the set. Seeding covers every number the source case carries, and the
      // assignment above only re-attaches a subset of those to the copied
      // defendants.
      this.logger.debug(
        `Duplicated indictment case ${caseId} into a new draft case ${newCaseId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error duplicating indictment case ${caseId} into a new draft case`,
        { error },
      )

      throw error
    }
  }

  // Splits a defendant off into a case of their own. The defendant and what
  // hangs off them - subpoenas, verdicts, defendant event logs, case files -
  // move to the new case; what the two cases share - victims, indictment
  // counts, the civil demands, the arraignment date, the case level files and
  // the events that brought the indictment to court - is copied. As with
  // duplication, the case is the one the route resolved, not a second read.
  async split(
    caseToSplit: Case,
    defendantId: string,
    options: SplitCaseOptions,
  ): Promise<Case> {
    const caseId = caseToSplit.id

    try {
      this.logger.debug(
        `Splitting defendant ${defendantId} from case ${caseId} into a new case`,
      )

      const { transaction } = options

      // The police case numbers assigned to no defendant go along to the new
      // case as well, except those the split off defendant holds - their own
      // rows are moved below
      const policeCaseNumbers =
        await this.caseDefendantPoliceCaseNumberRepositoryService.findUnassignedPoliceCaseNumbersForSplit(
          caseId,
          defendantId,
          { transaction },
        )

      // Create the new case
      const result = await this.caseRepositoryService.create(
        {
          ...pick(caseToSplit, splitFieldsToCopy),
          state: CaseState.SUBMITTED,
          splitCaseId: caseId,
          // The new case should have court session support
          withCourtSessions: true,
          // The new case is postponed indefinitely by default
          indictmentDecision: IndictmentDecision.POSTPONING,
          policeCaseNumbers,
        },
        { transaction },
      )

      const { id: newCaseId } = result

      // Move the defendant and what hangs off them to the new case
      await this.defendantRepositoryService.moveToCase(
        defendantId,
        caseId,
        newCaseId,
        { transaction },
      )

      await this.subpoenaRepositoryService.moveAllForDefendantToCase(
        caseId,
        defendantId,
        newCaseId,
        { transaction },
      )

      await this.verdictRepositoryService.moveAllForDefendantToCase(
        caseId,
        defendantId,
        newCaseId,
        { transaction },
      )

      await this.defendantEventLogRepositoryService.moveAllForDefendantToCase(
        caseId,
        defendantId,
        newCaseId,
        { transaction },
      )

      // Record why the new case is postponed indefinitely
      await this.caseStringRepositoryService.upsertByCaseAndType(
        newCaseId,
        StringType.POSTPONED_INDEFINITELY_EXPLANATION,
        `Ákærði klofinn frá máli ${caseToSplit.courtCaseNumber}.`,
        { transaction },
      )

      // Copy what the two cases share
      await this.caseStringRepositoryService.copyByTypesToCase(
        caseId,
        newCaseId,
        splitCaseStringTypesToCopy,
        { transaction },
      )

      await this.dateLogRepositoryService.copyByTypesToCase(
        caseId,
        newCaseId,
        splitDateTypesToCopy,
        { transaction },
      )

      await this.eventLogRepositoryService.copyByTypesToCase(
        caseId,
        newCaseId,
        splitEventTypesToCopy,
        { transaction },
      )

      await this.victimRepositoryService.copyAllToCase(caseId, newCaseId, {
        transaction,
      })

      // The offenses are not copied along with the counts - the split has
      // never done so, and whether it should is a decision about the split,
      // not about where the code lives
      await this.indictmentCountRepositoryService.copyAllToCase(
        caseId,
        newCaseId,
        { transaction },
      )

      // The defendant's case files leave with them; the files linked to no
      // defendant are needed by both cases
      await this.caseFileRepositoryService.moveAllForDefendantToCase(
        caseId,
        defendantId,
        newCaseId,
        splitCaseFileCategories,
        { transaction },
      )

      await this.caseFileRepositoryService.copyAllWithoutDefendantToCase(
        caseId,
        newCaseId,
        splitCaseFileCategories,
        { transaction },
      )

      await this.caseDefendantPoliceCaseNumberRepositoryService.moveAssignedRowsToCaseForDefendant(
        caseId,
        newCaseId,
        defendantId,
        { transaction },
      )

      // Unlike duplication, the police case numbers of the new case have
      // changed since it was created: the defendant's own assignments were
      // moved onto it just now, so they are resolved again onto the instance
      // that is returned
      await this.caseDefendantPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases(
        [result],
        { transaction },
      )

      this.logger.debug(
        `Split defendant ${defendantId} from case ${caseId} into a new case ${newCaseId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error splitting defendant ${defendantId} from case ${caseId} into a new case`,
        { error },
      )

      throw error
    }
  }
}
