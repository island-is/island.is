import { Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'
import {
  AssetOwner,
  Farm,
  PaginatedPayments,
  viewFarms,
  listAssets,
  listBeneficiaries,
  listFarms,
  searchPayments,
} from '../../gen/fetch'
import {
  MappedBeneficiaryWrapper,
  mapBeneficiaryPayment,
} from './farmers.types'

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
   * Get a single farm by id
   */
  public getFarm = async (user: User, farmId: string): Promise<Farm | null> => {
    const response = await withAuthContext(user, () =>
      dataOr404Null(viewFarms({ path: { farmId } })),
    )

    return response
  }

  /**
   * Get beneficiaries for a specific farm
   */
  public getFarmBeneficiaries = async (
    user: User,
    farmId: string,
  ): Promise<MappedBeneficiaryWrapper[]> => {
    const response = await withAuthContext(user, () =>
      dataOr404Null(listBeneficiaries({ path: { farmId } })),
    )

    if (!response || !response.data) {
      return []
    }

    return response.data.map((wrapper) => ({
      ...wrapper,
      list: (wrapper.list ?? []).map(mapBeneficiaryPayment),
    }))
  }

  /**
   * Get a single page of payments for a specific farm
   */
  public getFarmPayments = async (
    user: User,
    farmId: string,
    cursor?: string,
    order?: string,
    paymentCategoryId?: number,
    contractId?: string,
    dateFrom?: Date,
    dateTo?: Date,
  ): Promise<PaginatedPayments | null> => {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        searchPayments({
          path: { farmId },
          query: {
            ...(cursor ? { next: cursor } : {}),
            ...(order ? { order } : {}),
            ...(paymentCategoryId != null ? { paymentCategoryId } : {}),
            ...(contractId ? { contractId } : {}),
            ...(dateFrom ? { 'paymentDate.from': dateFrom } : {}),
            ...(dateTo ? { 'paymentDate.to': dateTo } : {}),
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
