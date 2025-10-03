import { User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  VmstUnemploymentClientService,
  GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationValidationResponseDTO,
} from '@island.is/clients/vmst-unemployment'
import { VmstApplicationsBankInformationInput } from './dto/bankInformationInput.input'

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
              id: input.pensionFund?.Id || '',
              percentage: input.pensionFund?.percentage,
            },
            union: {
              id: input.union?.Id || '',
            },
            supplementaryPensionFunds:
              input.privatePensionFunds?.map((fund) => ({
                id: fund.Id,
                percentage: fund.percentage,
              })) || [],
          },
        },
    }
    console.log('payload', payload)
    return this.vmstUnemploymentService.validateBankInfoUnemploymentApplication(
      payload,
    )
  }
}
