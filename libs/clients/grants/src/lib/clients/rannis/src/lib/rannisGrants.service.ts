import { GRANTS } from '../../../../mocks/grants.mock'
import { GrantDto } from '../../../../dto/grant.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RannisGrantService {
  constructor() {}

  getGrants = (): Promise<Array<GrantDto>> => {
    return Promise.resolve(GRANTS)
  }

  getGrantsByFund = (fundId: string): Promise<Array<GrantDto>> => {
    return Promise.resolve(GRANTS.filter((g) => g.applicationId === fundId))
  }

  getGrant = (grantId: string): Promise<GrantDto | undefined> => {
    return Promise.resolve(GRANTS.find((g) => g.id === grantId))
  }
}
