import { Injectable, Inject } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  GaldurExternalDomainRequestsWithdrawApplicationRequest,
  VmstUnemploymentClientService,
} from '@island.is/clients/vmst-unemployment'
import { TemplateApiModuleActionProps } from '../../../../types'
import { getValueViaPath } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { errorMsgs } from '@island.is/application/templates/vmst/de-register-unemployment-benefits'

@Injectable()
export class DeRegisterUnemploymentBenefitsService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly vmstUnemploymentClientService: VmstUnemploymentClientService,
  ) {
    super(ApplicationTypes.DEREGISTER_UNEMPLOYMENT_BENEFITS)
  }

  async getSupportData({ auth }: TemplateApiModuleActionProps) {
<<<<<<< HEAD
    let canWithdraw
    try {
      canWithdraw =
        await this.vmstUnemploymentClientService.canUserWithdrawUnemploymentApplication(
          auth,
        )
    } catch (e) {
      this.logger.error(
        '[VMST-Unemployment]: Error checking withdraw eligibility',
        e,
=======
    const resolvedApplicantId =
      await this.vmstUnemploymentClientService.resolveApplicant(auth)

    if (!resolvedApplicantId.applicantId) {
      throw new TemplateApiError(
        {
          title: errorMsgs.cannotApplyErrorTitle,
          summary: errorMsgs.cannotApplyErrorSummary,
        },
        400,
      )
    }
    const canWithdraw =
      await this.vmstUnemploymentClientService.canUserWithdrawUnemploymentApplication(
        resolvedApplicantId.applicantId,
      )

    if (!canWithdraw.isEligible) {
      this.logger.warn(
        '[VMST-Unemployment]: User cannot withdraw, creating application returned canWithdraw: False',
        canWithdraw.reason,
>>>>>>> origin/main
      )
      throw new TemplateApiError(
        {
          title: errorMsgs.cannotApplyErrorTitle,
<<<<<<< HEAD
          summary: errorMsgs.cannotApplyErrorSummary,
        },
        500,
      )
    }

    if (!canWithdraw.isEligible) {
      this.logger.warn(
        '[VMST-Unemployment]: User cannot withdraw, isEligible: false',
        canWithdraw.reason,
      )
      throw new TemplateApiError(
        {
          title: errorMsgs.cannotApplyErrorTitle,
=======
>>>>>>> origin/main
          summary: canWithdraw.reason || errorMsgs.cannotApplyErrorSummary,
        },
        400,
      )
    }

    const delistingReasons =
      await this.vmstUnemploymentClientService.withdrawApplicationSupportData()

    return {
      canWithdraw: canWithdraw.isEligible,
<<<<<<< HEAD
      applicationId: canWithdraw.applicationId,
=======
>>>>>>> origin/main
      delistingReasons,
    }
  }

  async submitApplication({ auth, application }: TemplateApiModuleActionProps) {
    const resolvedApplicantId =
      await this.vmstUnemploymentClientService.resolveApplicant(auth)

    const withDrawDate = getValueViaPath<string>(
      application.answers,
      'deregistrationDate',
    )
    const reason = getValueViaPath<string>(application.answers, 'reason')
    const requestObj: GaldurExternalDomainRequestsWithdrawApplicationRequest = {
      applicantId: resolvedApplicantId.applicantId,
      withdrawDate: withDrawDate ? new Date(withDrawDate) : undefined,
      reasonId: reason,
    }
    const requestParameter = {
      galdurExternalDomainRequestsWithdrawApplicationRequest: requestObj,
    }

    const response =
      await this.vmstUnemploymentClientService.withdrawUnemploymentApplication(
        requestParameter,
      )

    if (!response.success) {
      this.logger.error(
        `[VMST-DeregisterUnemploymentApplication]: Failed to submit application - ${response.errorMessage}`,
      )
      throw new TemplateApiError(
        {
          title: errorMsgs.submitError,
          summary: response.errorMessage || errorMsgs.submitError,
        },
        400,
      )
    }
  }
}
