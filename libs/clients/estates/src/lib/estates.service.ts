import { Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'
import {
  islandIsEstatePagesGetEstatePages,
  islandIsEstatePagesGetEstateCase,
  type Estate,
  type EstateCase,
} from '../../gen/fetch'

@Injectable()
export class EstatesClientService {
  async getEstates(user: User): Promise<Estate[]> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(islandIsEstatePagesGetEstatePages()),
    )

    return response?.estates ?? []
  }

  async getEstateCase(user: User, caseId: string): Promise<EstateCase | null> {
    return withAuthContext(user, () =>
      dataOr404Null(islandIsEstatePagesGetEstateCase({ path: { caseId } })),
    )
  }
}
