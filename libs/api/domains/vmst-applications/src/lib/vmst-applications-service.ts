import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { VmstUnemploymentClientService } from '@island.is/clients/vmst-unemployment'
import { BankInformationInput } from './dto/bankInformationInput.input'

@Injectable()
export class VMSTApplicationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly vmstUnemploymentService: VmstUnemploymentClientService,
  ) {}

  async validateBankInformation(
    auth: User,
    input: BankInformationInput,
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
