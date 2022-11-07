import { User } from '@island.is/auth-nest-tools'
import { RskProcuringClient } from '@island.is/clients/rsk/procuring'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { DelegationDTO, DelegationProvider } from './dto/delegation.dto'
import { DelegationType } from './types/delegationType'

@Injectable()
export class IncomingDelegationsCompanyService {
  constructor(
    private rskProcuringClient: RskProcuringClient,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findAllIncoming(user: User): Promise<DelegationDTO[]> {
    try {
      const person = await this.rskProcuringClient.getSimple(user)

      if (person && person.companies) {
        return person.companies.map(
          (p) =>
            <DelegationDTO>{
              toNationalId: user.nationalId,
              fromNationalId: p.nationalId,
              fromName: p.name,
              type: DelegationType.ProcurationHolder,
              provider: DelegationProvider.CompanyRegistry,
            },
        )
      }
    } catch (error) {
      this.logger.error('Error in findAllCompanies', error)
    }

    return []
  }
}
