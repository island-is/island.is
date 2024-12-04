import {
  CompanyDTO,
  SeminarsClientService,
} from '@island.is/clients/seminars-ver'
import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class SeminarsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly seminarsService: SeminarsClientService,
  ) {}

  async isCompanyValid(
    auth: User,
    nationalId: string,
  ): Promise<Array<CompanyDTO>> {
    return this.seminarsService.isCompanyValid(auth, nationalId)
  }
}
