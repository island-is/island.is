import { Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'
import { islandIsEstatePagesGet, type Estate } from '../../gen/fetch'

@Injectable()
export class EstatesClientService {
  async getEstates(user: User): Promise<Estate[]> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(islandIsEstatePagesGet()),
    )

    return response?.estates ?? []
  }
}
