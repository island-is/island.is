import { Inject, Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { data } from '@island.is/clients/middlewares'
import {
  analyzeApplicationSalaryReport,
  createApplicationReportDraft,
  deleteApplicationReportDraft,
  editApplicationEqualityContent,
  editApplicationOutliers,
  getApplicationActiveEqualityReport,
  getApplicationBlankExcelTemplate,
  getApplicationCompany,
  getApplicationDraftAnalysis,
  getApplicationDraftCriteriaTree,
  getApplicationEqualityReportTemplateDocx,
  getApplicationEqualityReportTemplateHtml,
  getApplicationReport,
  getApplicationReportDraft,
  getApplicationReportOutliers,
  importApplicationReportDraftWorkbook,
  importApplicationSalaryReportWorkbook,
  listApplicationDraftCriteria,
  listApplicationDraftEmployees,
  listApplicationDraftEmployeesWithSteps,
  listApplicationDraftOutlierGroups,
  listApplicationDraftRoles,
  listApplicationDraftRolesWithSteps,
  presignApplicationImportUpload,
  submitApplicationEqualityReport,
  submitApplicationReportComment,
  submitApplicationReportDraft,
  submitApplicationSalaryReport,
  syncApplicationReportDraft,
  updateApplicationReportDraft,
} from '../../gen/fetch'
import type {
  ApplicationReportCommentDto,
  ApplicationReportDetailDto,
  CompanyDto,
  CreateDraftReportDto,
  CreateReportResponseDto,
  DraftDetailDto,
  EditEqualityContentDto,
  EditOutliersDto,
  EqualityReportSummaryDto,
  GetDraftCriteriaResponseDto,
  GetDraftCriteriaTreeResponseDto,
  GetDraftEmployeesResponseDto,
  GetDraftEmployeesWithStepsResponseDto,
  GetDraftOutlierGroupsResponseDto,
  GetDraftRolesResponseDto,
  GetDraftRolesWithStepsResponseDto,
  GetReportOutliersResponseDto,
  ImportKeyDto,
  ParsedReportDto,
  PresignUploadResponseDto,
  SalaryAnalysisRequestDto,
  SalaryAnalysisResponseDto,
  SubmitApplicationReportCommentDto,
  SubmitDraftDto,
  SubmitEqualityReportDto,
  SubmitSalaryReportDto,
  SyncDraftDto,
  UpdateDraftDto,
} from '../../gen/fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

const LOGGING_CONTEXT = 'DirectorateOfEqualityClientService'

@Injectable()
export class DirectorateOfEqualityClientService {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {}

  private async unwrap<TResponse extends { data: unknown }>(
    user: User,
    fn: () => Promise<TResponse>,
    errorLogMessage: string,
  ) {
    try {
      return await data(withAuthContext(user, fn))
    } catch (error) {
      this.logger.error(errorLogMessage, { context: LOGGING_CONTEXT, error })
      throw error
    }
  }

  async getCompany(user: User): Promise<CompanyDto> {
    return this.unwrap(
      user,
      () => getApplicationCompany(),
      'Failed to get company data from DOE',
    )
  }

  async getActiveEqualityReport(user: User): Promise<EqualityReportSummaryDto> {
    return this.unwrap(
      user,
      () => getApplicationActiveEqualityReport(),
      'Failed to get active equality report',
    )
  }

  async getEqualityReportTemplateHtml(user: User): Promise<string> {
    return this.unwrap(
      user,
      () => getApplicationEqualityReportTemplateHtml(),
      'Failed to get equality report template HTML',
    )
  }

  async getEqualityReportTemplateDocx(user: User): Promise<Blob> {
    return this.unwrap(
      user,
      () => getApplicationEqualityReportTemplateDocx(),
      'Failed to get equality report template DOCX',
    )
  }

  async submitEqualityReport(
    user: User,
    body: SubmitEqualityReportDto,
  ): Promise<CreateReportResponseDto> {
    return this.unwrap(
      user,
      () => submitApplicationEqualityReport({ body }),
      'Failed to submit equality report',
    )
  }

  async getReport(
    user: User,
    providerId: string,
  ): Promise<ApplicationReportDetailDto> {
    return this.unwrap(
      user,
      () => getApplicationReport({ path: { providerId } }),
      'Failed to get report',
    )
  }

  async editEqualityContent(
    user: User,
    providerId: string,
    body: EditEqualityContentDto,
  ): Promise<ApplicationReportDetailDto> {
    return this.unwrap(
      user,
      () => editApplicationEqualityContent({ path: { providerId }, body }),
      'Failed to edit equality content',
    )
  }

  async getBlankExcelTemplate(user: User): Promise<Blob | File> {
    return this.unwrap(
      user,
      () => getApplicationBlankExcelTemplate(),
      'Failed to get blank Excel template',
    )
  }

  async presignImportUpload(user: User): Promise<PresignUploadResponseDto> {
    return this.unwrap(
      user,
      () => presignApplicationImportUpload(),
      'Failed to presign salary report upload',
    )
  }

  async importSalaryReportWorkbook(
    user: User,
    key: string,
  ): Promise<ParsedReportDto> {
    return this.unwrap(
      user,
      () => importApplicationSalaryReportWorkbook({ body: { key } }),
      'Failed to import salary report workbook',
    )
  }

  async analyzeSalaryReport(
    user: User,
    body: SalaryAnalysisRequestDto,
  ): Promise<SalaryAnalysisResponseDto> {
    return this.unwrap(
      user,
      () => analyzeApplicationSalaryReport({ body }),
      'Failed to analyze salary report',
    )
  }

  async submitSalaryReport(
    user: User,
    body: SubmitSalaryReportDto,
  ): Promise<CreateReportResponseDto> {
    return this.unwrap(
      user,
      () => submitApplicationSalaryReport({ body }),
      'Failed to submit salary report',
    )
  }

  async getReportOutliers(
    user: User,
    providerId: string,
    page?: number,
    pageSize?: number,
  ): Promise<GetReportOutliersResponseDto> {
    return this.unwrap(
      user,
      () =>
        getApplicationReportOutliers({
          path: { providerId },
          query: { page, pageSize },
        }),
      'Failed to get report outliers',
    )
  }

  async editOutliers(
    user: User,
    providerId: string,
    body: EditOutliersDto,
  ): Promise<ApplicationReportDetailDto> {
    return this.unwrap(
      user,
      () => editApplicationOutliers({ path: { providerId }, body }),
      'Failed to edit outliers',
    )
  }

  async submitReportComment(
    user: User,
    providerId: string,
    body: SubmitApplicationReportCommentDto,
  ): Promise<ApplicationReportCommentDto> {
    return this.unwrap(
      user,
      () => submitApplicationReportComment({ path: { providerId }, body }),
      'Failed to submit report comment',
    )
  }

  // ── Draft lifecycle ─────────────────────────────────────────────────────

  async createDraft(
    user: User,
    body: CreateDraftReportDto,
  ): Promise<CreateReportResponseDto> {
    return this.unwrap(
      user,
      () => createApplicationReportDraft({ body }),
      'Failed to create report draft',
    )
  }

  async getDraft(user: User, providerId: string): Promise<DraftDetailDto> {
    return this.unwrap(
      user,
      () => getApplicationReportDraft({ path: { providerId } }),
      'Failed to get report draft',
    )
  }

  async updateDraft(
    user: User,
    providerId: string,
    body: UpdateDraftDto,
  ): Promise<DraftDetailDto> {
    return this.unwrap(
      user,
      () => updateApplicationReportDraft({ path: { providerId }, body }),
      'Failed to update report draft',
    )
  }

  async deleteDraft(user: User, providerId: string): Promise<void> {
    return this.unwrap(
      user,
      () => deleteApplicationReportDraft({ path: { providerId } }),
      'Failed to delete report draft',
    )
  }

  async submitDraft(
    user: User,
    providerId: string,
    body: SubmitDraftDto,
  ): Promise<CreateReportResponseDto> {
    return this.unwrap(
      user,
      () => submitApplicationReportDraft({ path: { providerId }, body }),
      'Failed to submit report draft',
    )
  }

  async importDraftWorkbook(
    user: User,
    providerId: string,
    body: ImportKeyDto,
  ): Promise<DraftDetailDto> {
    return this.unwrap(
      user,
      () => importApplicationReportDraftWorkbook({ path: { providerId }, body }),
      'Failed to import report draft workbook',
    )
  }

  // ── Bulk sync ────────────────────────────────────────────────────────────

  async syncDraft(
    user: User,
    providerId: string,
    body: SyncDraftDto,
  ): Promise<void> {
    return this.unwrap(
      user,
      () => syncApplicationReportDraft({ path: { providerId }, body }),
      'Failed to sync report draft',
    )
  }

  async getDraftAnalysis(
    user: User,
    providerId: string,
  ): Promise<SalaryAnalysisResponseDto> {
    return this.unwrap(
      user,
      () => getApplicationDraftAnalysis({ path: { providerId } }),
      'Failed to get draft analysis',
    )
  }

  // ── Draft reads ──────────────────────────────────────────────────────────

  async listDraftRoles(
    user: User,
    providerId: string,
  ): Promise<GetDraftRolesResponseDto> {
    return this.unwrap(
      user,
      () => listApplicationDraftRoles({ path: { providerId } }),
      'Failed to list draft roles',
    )
  }

  async listDraftEmployees(
    user: User,
    providerId: string,
    page?: number,
    pageSize?: number,
  ): Promise<GetDraftEmployeesResponseDto> {
    return this.unwrap(
      user,
      () =>
        listApplicationDraftEmployees({
          path: { providerId },
          query: { page, pageSize },
        }),
      'Failed to list draft employees',
    )
  }

  async listDraftCriteria(
    user: User,
    providerId: string,
  ): Promise<GetDraftCriteriaResponseDto> {
    return this.unwrap(
      user,
      () => listApplicationDraftCriteria({ path: { providerId } }),
      'Failed to list draft criteria',
    )
  }

  async listDraftRolesWithSteps(
    user: User,
    providerId: string,
  ): Promise<GetDraftRolesWithStepsResponseDto> {
    return this.unwrap(
      user,
      () => listApplicationDraftRolesWithSteps({ path: { providerId } }),
      'Failed to list draft roles with steps',
    )
  }

  async listDraftEmployeesWithSteps(
    user: User,
    providerId: string,
    page?: number,
    pageSize?: number,
  ): Promise<GetDraftEmployeesWithStepsResponseDto> {
    return this.unwrap(
      user,
      () =>
        listApplicationDraftEmployeesWithSteps({
          path: { providerId },
          query: { page, pageSize },
        }),
      'Failed to list draft employees with steps',
    )
  }

  async getDraftCriteriaTree(
    user: User,
    providerId: string,
  ): Promise<GetDraftCriteriaTreeResponseDto> {
    return this.unwrap(
      user,
      () => getApplicationDraftCriteriaTree({ path: { providerId } }),
      'Failed to get draft criteria tree',
    )
  }

  async listDraftOutlierGroups(
    user: User,
    providerId: string,
  ): Promise<GetDraftOutlierGroupsResponseDto> {
    return this.unwrap(
      user,
      () => listApplicationDraftOutlierGroups({ path: { providerId } }),
      'Failed to list draft outlier groups',
    )
  }
}
