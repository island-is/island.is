import {
  CompanyDTO,
  IndividualDTO,
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

  async isCompanyValid(auth: User, nationalId: string): Promise<CompanyDTO> {
    return this.seminarsService.isCompanyValid(auth, nationalId)
  }

  async checkIndividuals(
    auth: User,
    nationalIds: Array<string>,
    courseID: number,
  ): Promise<Array<IndividualDTO>> {
    const tmp = this.seminarsService.checkIndividuals(
      auth,
      nationalIds,
      courseID,
    )
    const tmp2 = (await tmp).map((x, i) => {
      let neww = x
      if (i === 0) {
        neww = { ...x, mayTakeCourse: false }
      }
      return neww
    })
    return tmp2
  }
}
