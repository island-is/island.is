import { Injectable } from '@nestjs/common'
import { RannisGrantDto } from './dtos/rannisGrant.dto'
import { RANNIS_GRANTS } from './data'

@Injectable()
export class RannisGrantService {
  getGrants = (): Promise<Array<RannisGrantDto>> => {
    const grants = RANNIS_GRANTS
    return Promise.resolve(
      grants.map(grant => {
        {
          fundId:
      }
      }
      ))

  }

  getGrantsByFund = (fundId: string): Promise<Array<GrantDto>> => {
    return Promise.resolve(GRANTS.filter((g) => g.applicationId === fundId))
  }

  getGrant = (grantId: string): Promise<GrantDto | undefined> => {
    return Promise.resolve(GRANTS.find((g) => g.id === grantId))
  }
}
