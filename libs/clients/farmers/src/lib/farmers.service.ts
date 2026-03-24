import { Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'
import {
  AssetOwner,
  BeneficiaryWrapper,
  Farm,
  PaginatedPayments,
  listAssets,
  listBeneficiaries,
  listFarms,
  searchPayments,
} from '../../gen/fetch'

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

  /**
   * Get beneficiaries for a specific farm
   */
  public getFarmBeneficiaries = async (
    user: User,
    farmId: string,
  ): Promise<BeneficiaryWrapper[]> => {
    const response = await withAuthContext(user, () =>
      dataOr404Null(listBeneficiaries({ path: { farmId } })),
    )

    if (!response || !response.data) {
      return []
    }

    return response.data
  }

  /**
   * Get a single page of payments for a specific farm
   */
  public getFarmPayments = async (
    user: User,
    farmId: string,
    cursor?: string,
    order?: string,
  ): Promise<PaginatedPayments | null> => {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        searchPayments({
          path: { farmId },
          query: {
            ...(cursor ? { next: cursor } : {}),
            ...(order ? { order } : {}),
          },
        }),
      ),
    )
    return response ?? null
  }

  /**
   * Get assets for a specific farm
   */
  public getFarmAssets = async (
    user: User,
    farmId: string,
  ): Promise<AssetOwner[]> => {
    const response = await withAuthContext(user, () =>
      dataOr404Null(listAssets({ path: { farmId } })),
    )

    if (!response || !response.data) {
      return []
    }

    return response.data
  }
}
