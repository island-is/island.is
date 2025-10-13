import { User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { VmstUnemploymentClientService } from '@island.is/clients/vmst-unemployment'
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
}
