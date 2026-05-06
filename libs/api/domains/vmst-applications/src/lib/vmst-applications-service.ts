import { User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  VmstUnemploymentClientService,
  GaldurXRoadAPIModelsApplicantApplicantOverviewResponse,
  GaldurExternalDomainModelsAttachmentAttachmentRequestDTO,
  GaldurXRoadAPIModelsAvailableActions,
  GaldurDomainModelsSettingsAttachmentTypesAttachmentTypeListViewModel,
} from '@island.is/clients/vmst-unemployment'
import { VmstApplicationsBankInformationInput } from './dto/bankInformationInput.input'
import { VmstApplicationsVacationValidationInput } from './dto/vacationValidation.input'
import {
  VmstApplicationsUnemploymentApplicationOverview,
  VmstApplicationsValidationUnemploymentApplication,
} from './models'
import type { Locale } from '@island.is/shared/types'

@Injectable()
export class VMSTApplicationsService {
  constructor(
    private readonly vmstUnemploymentService: VmstUnemploymentClientService,
  ) {}

  async validateBankInformation(
    auth: User,
    input: VmstApplicationsBankInformationInput,
  ): Promise<boolean> {
    const payload = {
      galdurApplicationApplicationsB2BQueriesValidateBankInformationQuery: {
        applicantSSN: auth.nationalId,
        ...input,
      },
    }

    return this.vmstUnemploymentService.validateBankInfo(payload)
  }

  async validateBankInformationUnemploymentApplication(
    auth: User,
    input: VmstApplicationsBankInformationInput,
  ): Promise<VmstApplicationsValidationUnemploymentApplication> {
    const payload = {
      galdurApplicationApplicationsUnemploymentApplicationsCommandsValidateUnemploymentApplicationPaymentPageValidateUnemploymentApplicationPaymentPageCommand:
        {
          ssn: auth.nationalId,
          bankingPensionUnion: {
            bankId: input.bankNumber,
            ledgerId: input.ledger,
            accountNumber: input.accountNumber,
            pensionFund: {
              id: input.pensionFund?.id || '',
              percentage: input.pensionFund?.percentage,
            },
            doNotPayToUnion: input.doNotPayToUnion,
            union: {
              id: input.union?.id || '',
            },
            supplementaryPensionFunds:
              input.privatePensionFunds?.map((fund) => ({
                id: fund.id,
                percentage: fund.percentage,
              })) || [],
          },
        },
    }
    const response =
      await this.vmstUnemploymentService.validateBankInfoUnemploymentApplication(
        payload,
      )
    return { ...response, isValid: response.isValid ?? false }
  }

  async validateVacationDays(
    auth: User,
    input: VmstApplicationsVacationValidationInput,
  ): Promise<VmstApplicationsValidationUnemploymentApplication> {
    const payload = {
      galdurApplicationApplicationsUnemploymentApplicationsCommandsValidateUnemploymentApplicationUnpaidVacationValidateUnemploymentApplicationUnpaidVacationCommand:
        {
          ssn: auth.nationalId,
          employerSettlement: {
            hasUnpaidVacationTime: input.hasUnpaidVacationTime,
            unpaidVacations: input.unpaidVacations?.map((x) => {
              return {
                unpaidVacationDays: x.unpaidVacationDays,
                unpaidVacationStart: x.unpaidVacationStart,
                unpaidVacationEnd: x.unpaidVacationEnd,
              }
            }),
            resignationEnds: input.resignationEnds,
          },
        },
    }

    const response =
      await this.vmstUnemploymentService.validateVacationInfoUnemploymentApplication(
        payload,
      )
    return { ...response, isValid: response.isValid ?? false }
  }

  async getApplicationOverview(
    auth: User,
    locale?: Locale,
  ): Promise<VmstApplicationsUnemploymentApplicationOverview> {
    return this.vmstUnemploymentService.getApplicationOverview(auth, locale)
  }

  async resolveApplicant(auth: User): Promise<{ applicantId: string }> {
    return await this.vmstUnemploymentService.resolveApplicant(auth)
  }

  async getApplicationsOverview(applicantId: string) {
    return this.vmstUnemploymentService.getApplicationsOverview(applicantId)
  }

  async getApplicantOverview(
    applicantId: string,
    locale?: Locale,
  ): Promise<GaldurXRoadAPIModelsApplicantApplicantOverviewResponse> {
    return this.vmstUnemploymentService.getApplicantOverview(
      applicantId,
      locale,
    )
  }

  async getApplicantRequestedAttachments(
    applicantId: string,
  ): Promise<Array<GaldurExternalDomainModelsAttachmentAttachmentRequestDTO>> {
    return this.vmstUnemploymentService.getApplicantRequestedAttachments(
      applicantId,
    )
  }

  async getApplicantActions(
    applicantId: string,
  ): Promise<GaldurXRoadAPIModelsAvailableActions> {
    return this.vmstUnemploymentService.getApplicantActions(applicantId)
  }

  async getAttachmentTypes(): Promise<GaldurDomainModelsSettingsAttachmentTypesAttachmentTypeListViewModel> {
    return this.vmstUnemploymentService.getAttachmentTypes()
  }
}
