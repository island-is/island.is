import { Injectable, Inject } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { VmstUnemploymentClientService } from '@island.is/clients/vmst-unemployment'
import { TemplateApiModuleActionProps } from '../../../../types'
import { errorMessages } from '@island.is/application/templates/vmst/confirm-job-or-income'
import { TemplateApiError } from '@island.is/nest/problem'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import format from 'date-fns/format'
import { buildCreateIncomesRequest } from './confirm-job-or-income.utils'

@Injectable()
export class ConfirmJobOrIncomeService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
  ) {
    super(ApplicationTypes.CONFIRM_JOB_OR_INCOME)
  }

  async getCanReportWork({
    auth,
  }: TemplateApiModuleActionProps): Promise<{ canReportWork: boolean }> {
    let applicantId: string

    try {
      const result = await this.vmstUnemploymentClientService.resolveApplicant(
        auth,
      )
      applicantId = result.applicantId
    } catch (e) {
      this.logger.error(
        '[VMST-Confirm-Job-Or-Income] - Error checking eligibility',
        e,
      )
      throw new TemplateApiError(
        {
          title: errorMessages.cannotApplyErrorTitle,
          summary: errorMessages.cannotApplyErrorSummary,
        },
        400,
      )
    }

    let canReportWork: boolean

    try {
      const actions =
        await this.vmstUnemploymentClientService.getApplicantActions(
          applicantId,
        )
      canReportWork = !!actions.canReportWork
    } catch (e) {
      this.logger.error(
        '[VMST-Confirm-Job-Or-Income] - Error fetching applicant actions',
        e,
      )
      throw new TemplateApiError(
        {
          title: errorMessages.cannotApplyErrorTitle,
          summary: errorMessages.cannotApplyErrorSummary,
        },
        400,
      )
    }

    if (!canReportWork) {
      throw new TemplateApiError(
        {
          title: errorMessages.cannotApplyErrorTitle,
          summary: errorMessages.cannotApplyErrorSummary,
        },
        400,
      )
    }

    return { canReportWork: true }
  }

  async getPensionFunds() {
    return await this.vmstUnemploymentClientService.getPensionFunds()
  }

  async getIncomeTypes() {
    const [trTypes, pensionTypes, capitalIncomeTypes] = await Promise.all([
      this.vmstUnemploymentClientService.getIncomeTypes({
        onlyTrTypes: true,
      }),
      this.vmstUnemploymentClientService.getIncomeTypes({
        onlyPensionTypes: true,
      }),
      this.vmstUnemploymentClientService.getIncomeTypes({
        onlyCapitalTypes: true,
      }),
    ])

    return { trTypes, pensionTypes, capitalIncomeTypes }
  }

  async getIncome({ auth }: TemplateApiModuleActionProps) {
    let applicantId: string

    try {
      const result = await this.vmstUnemploymentClientService.resolveApplicant(
        auth,
      )
      applicantId = result.applicantId
    } catch (e) {
      this.logger.error(
        '[VMST-Confirm-Job-Or-Income] - Error resolving applicant when fetching income',
        e,
      )
      throw new TemplateApiError(
        {
          title: errorMessages.cannotApplyErrorTitle,
          summary: errorMessages.cannotApplyErrorSummary,
        },
        400,
      )
    }

    try {
      const now = new Date()
      return await this.vmstUnemploymentClientService.getIncome({
        applicantId,
        dateFrom: format(
          new Date(now.getFullYear(), now.getMonth(), 1),
          'yyyy-MM-dd',
        ),
      })
    } catch (e) {
      this.logger.error(
        '[VMST-Confirm-Job-Or-Income] - Error fetching income',
        e,
      )
      throw new TemplateApiError(
        {
          title: errorMessages.cannotApplyErrorTitle,
          summary: errorMessages.cannotApplyErrorSummary,
        },
        400,
      )
    }
  }

  async getWorkshiftPeriods() {
    return await this.vmstUnemploymentClientService.getWorkshiftPeriods()
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    let applicantId: string

    try {
      const result = await this.vmstUnemploymentClientService.resolveApplicant(
        auth,
      )
      applicantId = result.applicantId
    } catch (e) {
      this.logger.error(
        '[VMST-Confirm-Job-Or-Income] - Error getting applicant information',
        e,
      )
      throw new TemplateApiError(
        {
          title: errorMessages.cannotApplyErrorTitle,
          summary: errorMessages.submitError,
        },
        500,
      )
    }

    const request = buildCreateIncomesRequest(
      application.answers,
      application.externalData,
    )
    try {
      const response = await this.vmstUnemploymentClientService.createIncome({
        applicantId,
        galdurExternalDomainRequestsIncomeCreateIncomesRequest: request,
      })

      if (!response.success) {
        throw new Error('VMST rejected the income submission')
      }
    } catch (e) {
      this.logger.error(
        '[VMST-Confirm-Job-Or-Income] - Error submitting job or income information',
        e,
      )
      throw new TemplateApiError(
        {
          title: errorMessages.cannotApplyErrorTitle,
          summary: errorMessages.submitError,
        },
        500,
      )
    }
  }
}
