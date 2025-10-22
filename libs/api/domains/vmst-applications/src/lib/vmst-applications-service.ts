import { User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  VmstUnemploymentClientService,
  GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationValidationResponseDTO,
} from '@island.is/clients/vmst-unemployment'
import { VmstApplicationsBankInformationInput } from './dto/bankInformationInput.input'
import { VmstApplicationsVacationValidationInput } from './dto/vacationValidation.input'

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
  ): Promise<GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationValidationResponseDTO> {
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
    return this.vmstUnemploymentService.validateBankInfoUnemploymentApplication(
      payload,
    )
  }

  async validateVacationDays(
    auth: User,
    input: VmstApplicationsVacationValidationInput,
  ): Promise<GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationValidationResponseDTO> {
    const payload = {
      galdurApplicationApplicationsUnemploymentApplicationsCommandsValidateUnemploymentApplicationUnpaidVacationValidateUnemploymentApplicationUnpaidVacationCommand:
        {
          ssn: auth.nationalId,
          employerSettlement: {
            hasUnpaidVacationTime: input.hasUnpaidVacationTime,
            unpaidVacations: input.unpaidVacations,
            resignationEnds: input.resignationEnds,
          },
        },
    }

    return this.vmstUnemploymentService.validateVacationInfoUnemploymentApplication(
      payload,
    )
  }
}
