import pick from 'lodash/pick'
import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  CaseFileCategory,
  CaseState,
  CaseType,
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
  DefendantRepositoryService,
  IndictmentCountRepositoryService,
  OffenseRepositoryService,
  VictimRepositoryService,
} from '../repository'

interface DuplicateCaseOptions {
  transaction: Transaction
  // The prosecutor that owns the new draft case
  prosecutorId?: string
  prosecutorsOfficeId?: string
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

// Copies a case's object graph - the case row, its defendants, indictment
// counts and offenses, victims, case strings, civil claimants and case files -
// into a new case, with variations. The per-model copies live in the
// repositories; this service owns the order, the id remapping between them
// and the S3 objects behind the case files.
@Injectable()
export class CaseCloningService {
  constructor(
    private readonly caseRepositoryService: CaseRepositoryService,
    private readonly caseDefendantPoliceCaseNumberRepositoryService: CaseDefendantPoliceCaseNumberRepositoryService,
    private readonly defendantRepositoryService: DefendantRepositoryService,
    private readonly indictmentCountRepositoryService: IndictmentCountRepositoryService,
    private readonly offenseRepositoryService: OffenseRepositoryService,
    private readonly victimRepositoryService: VictimRepositoryService,
    private readonly caseStringRepositoryService: CaseStringRepositoryService,
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

  async duplicateIndictmentToDraft(
    caseId: string,
    options: DuplicateCaseOptions,
  ): Promise<Case> {
    try {
      this.logger.debug(
        `Duplicating indictment case ${caseId} into a new draft case`,
      )

      const { transaction, prosecutorId, prosecutorsOfficeId } = options

      const caseToDuplicate = await this.caseRepositoryService.findById(
        caseId,
        { transaction },
      )

      if (!caseToDuplicate) {
        // This is a programmer error, so we throw an exception
        throw new InternalServerErrorException(`Case ${caseId} not found`)
      }

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

      await this.caseDefendantPoliceCaseNumberRepositoryService.resolvePoliceCaseNumbersForCases(
        [result],
        { transaction },
      )

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
}
