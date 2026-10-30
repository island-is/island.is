import { Injectable } from '@nestjs/common'

import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'

import {
  type EDocument,
  type Estate,
  type EstateCase,
  islandIsEstatePagesDocument,
  islandIsEstatePagesGetEstateCase,
  islandIsEstatePagesGetEstatePages,
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

  async getDocument(
    user: User,
    documentId: string,
    signal?: AbortSignal,
  ): Promise<EDocument | null> {
    return withAuthContext(user, () =>
      dataOr404Null(
        islandIsEstatePagesDocument({ path: { documentId }, signal }),
      ),
    )
  }
}
