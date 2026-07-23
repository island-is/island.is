import { Inject, Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { data } from '@island.is/clients/middlewares'
import {
  analyzeApplicationSalaryReport,
  editApplicationEqualityContent,
  editApplicationOutliers,
  getApplicationActiveEqualityReport,
  getApplicationBlankExcelTemplate,
  getApplicationCompany,
  getApplicationEqualityReportTemplateDocx,
  getApplicationEqualityReportTemplateHtml,
  getApplicationReport,
  getApplicationReportOutliers,
  importApplicationSalaryReportWorkbook,
  presignApplicationImportUpload,
  submitApplicationEqualityReport,
  submitApplicationReportComment,
  submitApplicationSalaryReport,
} from '../../gen/fetch'
import type {
  ApplicationReportCommentDto,
  ApplicationReportDetailDto,
  CompanyDto,
  CreateReportResponseDto,
  EditEqualityContentDto,
  EditOutliersDto,
  EqualityReportSummaryDto,
  GetReportOutliersResponseDto,
  ParsedReportDto,
  PresignUploadResponseDto,
  SalaryAnalysisRequestDto,
  SalaryAnalysisResponseDto,
  SubmitApplicationReportCommentDto,
  SubmitEqualityReportDto,
  SubmitSalaryReportDto,
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
}
