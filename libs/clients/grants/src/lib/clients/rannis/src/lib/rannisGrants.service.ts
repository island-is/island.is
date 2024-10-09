import { User } from '@island.is/auth-nest-tools'
import { GrantDto } from './dto/grant.dto'
import { GRANTS } from './mocks/grants.mock'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RannisGrantService {
  constructor() {}

  getGrants = (user: User): Promise<Array<GrantDto>> => {
    return Promise.resolve(GRANTS)
  }

  getGrantsByFund = (user: User, fundId: string): Promise<Array<GrantDto>> => {
    return Promise.resolve(GRANTS.filter((g) => g.fundId === fundId))
  }

  getGrant = (user: User, grantId: string): Promise<GrantDto | undefined> => {
    return Promise.resolve(GRANTS.find((g) => g.id === grantId))
  }
}
