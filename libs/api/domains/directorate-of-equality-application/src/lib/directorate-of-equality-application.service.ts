import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common'

import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { ApplicationsApi } from '@island.is/api/domains/application'
import { DirectorateOfEqualityClientService } from '@island.is/clients/directorate-of-equality'
import type {
  GetDraftEmployeesResponseDto,
  GetDraftEmployeesWithStepsResponseDto,
  ReportAttachmentDto,
  SyncDraftDto,
} from '@island.is/clients/directorate-of-equality'
import { FetchError } from '@island.is/clients/middlewares'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import type { Locale } from '@island.is/shared/types'

import { DraftEmployeesInput } from './dto/draftEmployees.input'
import { EditEqualityContentInput } from './dto/editEqualityContent.input'
import {
  AddEqualityAttachmentInput,
  DeleteEqualityAttachmentInput,
  EqualityAttachmentsInput,
  PresignEqualityAttachmentInput,
  PresignEqualityPlanInput,
} from './dto/equalityAttachment.input'
import type { PresignedUploadModel } from './dto/equalityAttachment.model'
import { SyncSalaryReportDraftInput } from './dto/syncSalaryReportDraft.input'
import { UpdateEqualityDraftContentInput } from './dto/updateEqualityDraftContent.input'
import {
  EQUALITY_PLAN_REJECTED,
  buildEqualityContentBody,
} from './equalityContent'
import {
  normaliseAttachmentExtension,
  toAttachmentRejection,
} from './equalityAttachments'

const LOGGING_CONTEXT = 'DirectorateOfEqualityApplicationService'

// equality-report's States: DMR accepts attachment changes while the report is
// DRAFT or IN_REVIEW, which on island.is are mainForm and draftRetryForm.
const ATTACHMENT_EDITABLE_STATES = ['draft', 'draftRetry']

// Same for the plan PDF's presign: DMR takes a new plan while the report is
// DRAFT or IN_REVIEW.
const PLAN_EDITABLE_STATES = ['draft', 'draftRetry']

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
    expectedState?: string | string[],
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

    const expectedStates =
      expectedState === undefined ? undefined : [expectedState].flat()
    if (expectedStates && !expectedStates.includes(application.state)) {
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
    const push = () =>
      this.directorateOfEqualityService.updateDraft(
        user,
        input.applicationId,
        buildEqualityContentBody(input),
      )
    await (input.equalityReportPdfKey
      ? this.withPlanUploadErrors(input.applicationId, push)
      : push())
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
    const push = () =>
      this.directorateOfEqualityService.editEqualityContent(
        user,
        input.applicationId,
        buildEqualityContentBody(input),
      )
    await (input.equalityReportPdfKey
      ? this.withPlanUploadErrors(input.applicationId, push)
      : push())
    return true
  }

  // The plan PDF goes from the browser straight to S3, like a fylgiskjal; only
  // the key comes back through the content mutations above. DMR allows it
  // while the report is DRAFT or IN_REVIEW (mainForm and draftRetryForm).
  async presignEqualityPlan(
    input: PresignEqualityPlanInput,
    user: User,
  ): Promise<PresignedUploadModel> {
    await this.assertOwnsApplication(
      input.applicationId,
      user,
      'is',
      PLAN_EDITABLE_STATES,
    )
    const { url, key } = await this.withPlanUploadErrors(
      input.applicationId,
      () =>
        this.directorateOfEqualityService.presignEqualityPlan(
          user,
          input.applicationId,
        ),
    )
    return { url, key }
  }

  /**
   * The presigned plan path: presign, and a content push carrying a key.
   * DMR's 4xx reasons (`details`) are English developer text, so they are
   * logged here and the UI gets only the EQUALITY_PLAN_REJECTED title to show
   * its own message under. Inline HTML and base64 PDF pushes don't use this
   * and fail as before.
   */
  private async withPlanUploadErrors<T>(
    applicationId: string,
    action: () => Promise<T>,
  ): Promise<T> {
    try {
      return await action()
    } catch (error) {
      if (error instanceof FetchError) {
        const body = error.body as
          | { message?: unknown; details?: unknown }
          | undefined
        this.logger.warn('DMR refused an equality plan upload', {
          applicationId,
          status: error.status,
          message: body?.message,
          details: body?.details,
          context: LOGGING_CONTEXT,
        })
        if (error.status >= 400 && error.status < 500) {
          throw new HttpException(
            { error: EQUALITY_PLAN_REJECTED, message: '' },
            error.status,
          )
        }
      }
      throw error
    }
  }

  // DMR's 4xx answers to an attachment call carry a curated, localized reason
  // (unsupported type, macros found, contents don't match the extension, report
  // no longer editable, 6 already attached). Re-thrown with that reason as the
  // problem detail so the UI can show it. Anything else propagates as is.
  private async withAttachmentErrors<T>(
    applicationId: string,
    action: () => Promise<T>,
  ): Promise<T> {
    try {
      return await action()
    } catch (error) {
      if (error instanceof FetchError) {
        const rejection = toAttachmentRejection(error.status, error.body)
        if (rejection) {
          this.logger.warn('DMR refused an equality attachment call', {
            applicationId,
            status: error.status,
            message: (error.body as { message?: unknown } | undefined)?.message,
            context: LOGGING_CONTEXT,
          })
          throw rejection
        }
      }
      throw error
    }
  }

  async listEqualityAttachments(
    input: EqualityAttachmentsInput,
    user: User,
  ): Promise<ReportAttachmentDto[]> {
    await this.assertOwnsApplication(input.applicationId, user, 'is')
    const { attachments } =
      await this.directorateOfEqualityService.getEqualityAttachments(
        user,
        input.applicationId,
      )
    return attachments
  }

  async presignEqualityAttachment(
    input: PresignEqualityAttachmentInput,
    user: User,
  ): Promise<PresignedUploadModel> {
    const extension = normaliseAttachmentExtension(input.extension)
    if (!extension) {
      throw new BadRequestException(`Unsupported extension: ${input.extension}`)
    }
    await this.assertOwnsApplication(
      input.applicationId,
      user,
      'is',
      ATTACHMENT_EDITABLE_STATES,
    )
    const { url, key } = await this.withAttachmentErrors(
      input.applicationId,
      () =>
        this.directorateOfEqualityService.presignEqualityAttachment(
          user,
          input.applicationId,
          extension,
        ),
    )
    return { url, key }
  }

  async addEqualityAttachment(
    input: AddEqualityAttachmentInput,
    user: User,
  ): Promise<ReportAttachmentDto> {
    await this.assertOwnsApplication(
      input.applicationId,
      user,
      'is',
      ATTACHMENT_EDITABLE_STATES,
    )
    return this.withAttachmentErrors(input.applicationId, () =>
      this.directorateOfEqualityService.addEqualityAttachment(
        user,
        input.applicationId,
        { key: input.key, filename: input.filename },
      ),
    )
  }

  async deleteEqualityAttachment(
    input: DeleteEqualityAttachmentInput,
    user: User,
  ): Promise<boolean> {
    await this.assertOwnsApplication(
      input.applicationId,
      user,
      'is',
      ATTACHMENT_EDITABLE_STATES,
    )
    await this.withAttachmentErrors(input.applicationId, () =>
      this.directorateOfEqualityService.deleteEqualityAttachment(
        user,
        input.applicationId,
        input.attachmentId,
      ),
    )
    return true
  }
}
