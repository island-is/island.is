import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { ApplicationsApi } from '@island.is/api/domains/application'
import { DirectorateOfEqualityClientService } from '@island.is/clients/directorate-of-equality'
import type {
  GetDraftEmployeesResponseDto,
  GetDraftEmployeesWithStepsResponseDto,
  SyncDraftDto,
} from '@island.is/clients/directorate-of-equality'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import type { Locale } from '@island.is/shared/types'

import { DraftEmployeesInput } from './dto/draftEmployees.input'
import { EditEqualityContentInput } from './dto/editEqualityContent.input'
import { SyncSalaryReportDraftInput } from './dto/syncSalaryReportDraft.input'
import { UpdateEqualityDraftContentInput } from './dto/updateEqualityDraftContent.input'

const LOGGING_CONTEXT = 'DirectorateOfEqualityApplicationService'

@Injectable()
export class DirectorateOfEqualityApplicationService {
  constructor(
    private readonly applicationsApi: ApplicationsApi,
    private readonly directorateOfEqualityService: DirectorateOfEqualityClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private applicationApiWithAuth(auth: Auth) {
    return this.applicationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  // Duplicates apps/application-system's ownership check since this resolver sits outside that REST layer and nothing else verifies the caller owns applicationId.
  // expectedState additionally rejects calls made outside the state the mutation is meant for (e.g. a
  // content edit fired at IN_REVIEW/APPROVED/DENIED instead of DRAFT_RETRY) — callers that are valid across
  // every state (draft sync, draft employee listing) simply omit it.
  private async assertOwnsApplication(
    applicationId: string,
    user: User,
    locale: Locale,
    expectedState?: string,
  ): Promise<void> {
    let application
    try {
      application = await this.applicationApiWithAuth(
        user,
      ).applicationControllerFindOne({
        id: applicationId,
        locale,
      })
    } catch (error) {
      this.logger.warn('Rejected draft sync: caller does not own application', {
        applicationId,
        context: LOGGING_CONTEXT,
      })
      throw error
    }

    if (expectedState && application.state !== expectedState) {
      this.logger.warn(
        'Rejected draft sync: application is not in the expected state',
        {
          applicationId,
          expectedState,
          actualState: application.state,
          context: LOGGING_CONTEXT,
        },
      )
      throw new BadRequestException(
        `Application ${applicationId} is not in the expected state`,
      )
    }
  }

  // The application UUID doubles as the DMR draft's providerId, so no separate lookup is needed.
  async syncSalaryReportDraft(
    input: SyncSalaryReportDraftInput,
    user: User,
  ): Promise<boolean> {
    const locale = (input.locale as Locale) ?? 'is'
    await this.assertOwnsApplication(input.applicationId, user, locale)

    const body: SyncDraftDto = {
      criteria: input.criteria as SyncDraftDto['criteria'],
      subCriteria: input.subCriteria as SyncDraftDto['subCriteria'],
      steps: input.steps as SyncDraftDto['steps'],
      roles: input.roles as SyncDraftDto['roles'],
      employees: input.employees as SyncDraftDto['employees'],
      outlierGroups: input.outlierGroups as SyncDraftDto['outlierGroups'],
    }

    await this.directorateOfEqualityService.syncDraft(
      user,
      input.applicationId,
      body,
    )

    return true
  }

  async listDraftEmployees(
    input: DraftEmployeesInput,
    user: User,
  ): Promise<GetDraftEmployeesResponseDto> {
    await this.assertOwnsApplication(input.applicationId, user, 'is')
    return this.directorateOfEqualityService.listDraftEmployees(
      user,
      input.applicationId,
      input.page,
      input.pageSize,
    )
  }

  async listDraftEmployeesWithSteps(
    input: DraftEmployeesInput,
    user: User,
  ): Promise<GetDraftEmployeesWithStepsResponseDto> {
    await this.assertOwnsApplication(input.applicationId, user, 'is')
    return this.directorateOfEqualityService.listDraftEmployeesWithSteps(
      user,
      input.applicationId,
      input.page,
      input.pageSize,
    )
  }

  // Custom resolver, not the standard updateApplicationExternalData provider
  // mechanism — that only takes {actionId, order}, with no channel for an
  // arbitrary content payload. Content goes straight to DMR, never through
  // application.answers.
  async updateEqualityDraftContent(
    input: UpdateEqualityDraftContentInput,
    user: User,
  ): Promise<boolean> {
    // 'draft' matches equality-report's States.DRAFT — the only state this content push is valid in.
    await this.assertOwnsApplication(input.applicationId, user, 'is', 'draft')
    await this.directorateOfEqualityService.updateDraft(
      user,
      input.applicationId,
      { equalityReportContent: input.equalityReportContent },
    )
    return true
  }

  // Same rationale as updateEqualityDraftContent, but for an already-submitted
  // (IN_REVIEW) report during a case-worker-requested revision, not a DRAFT.
  async editEqualityContent(
    input: EditEqualityContentInput,
    user: User,
  ): Promise<boolean> {
    // 'draftRetry' matches equality-report's States.DRAFT_RETRY — the only state this edit is valid in.
    await this.assertOwnsApplication(
      input.applicationId,
      user,
      'is',
      'draftRetry',
    )
    await this.directorateOfEqualityService.editEqualityContent(
      user,
      input.applicationId,
      { equalityReportContent: input.equalityReportContent },
    )
    return true
  }
}
