import { Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'
import { listFarms } from '../../gen/fetch'
import type { Farm } from '../../gen/fetch'

@Injectable()
export class FarmersClientService {
  /**
   * Get list of farms for the authenticated user
   */
  public getFarmsCollection = async (user: User): Promise<Farm[]> => {
    const response = await withAuthContext(user, () =>
      dataOr404Null(listFarms()),
    )

    if (!response || !response.data) {
      return []
    }

    return response.data
  }
}
