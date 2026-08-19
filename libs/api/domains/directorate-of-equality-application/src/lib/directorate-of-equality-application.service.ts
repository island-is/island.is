import { Inject, Injectable } from '@nestjs/common'

import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { ApplicationsApi } from '@island.is/api/domains/application'
import { DirectorateOfEqualityClientService } from '@island.is/clients/directorate-of-equality'
import type { SyncDraftDto } from '@island.is/clients/directorate-of-equality'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import type { Locale } from '@island.is/shared/types'

import { SyncSalaryReportDraftInput } from './dto/syncSalaryReportDraft.input'

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

  // Reuses the exact ownership check apps/application-system/api's
  // ApplicationAccessService performs on its own REST endpoints (a 404/403
  // from the generated client propagates the same way here) — this resolver
  // sits outside that REST layer entirely, so nothing else establishes that
  // the caller actually owns `applicationId` before we forward a batch to
  // DMR on their behalf.
  private async assertOwnsApplication(
    applicationId: string,
    user: User,
    locale: Locale,
  ): Promise<void> {
    try {
      await this.applicationApiWithAuth(user).applicationControllerFindOne({
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
  }

  // The island.is application UUID doubles as the DMR draft's `providerId` —
  // the draft is created with `providerId: application.id`, so no separate
  // lookup is needed here.
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
}
