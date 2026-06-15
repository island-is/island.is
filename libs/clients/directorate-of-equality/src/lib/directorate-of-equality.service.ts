import { Inject, Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { data } from '@island.is/clients/middlewares'
import {
  editApplicationEqualityContent,
  getApplicationActiveEqualityReport,
  getApplicationEqualityReportTemplateDocx,
  getApplicationEqualityReportTemplateHtml,
  getApplicationReport,
  submitApplicationEqualityReport,
} from '../../gen/fetch'
import type {
  ApplicationReportDetailDto,
  CreateReportResponseDto,
  EditEqualityContentDto,
  EqualityReportSummaryDto,
  SubmitEqualityReportDto,
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
}
