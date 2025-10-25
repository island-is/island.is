import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { AidsandnutritionApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { isDefined } from '@island.is/shared/utils'
import { Injectable } from '@nestjs/common'
import {
  AidOrNutritionType,
  generateAidOrNutrition,
} from './utils/generateAidOrNutrition'
import { PaginatedAidOrNutritionResponse } from './models/aidOrNutrition.model'
import { handle404 } from '@island.is/clients/middlewares'
import { Renew } from './models/renewAidOrNutrition.model'

@Injectable()
export class AidOrNutritionService {
  constructor(private api: AidsandnutritionApi) {}

  async getAidOrNutrition(
    user: User,
  ): Promise<PaginatedAidOrNutritionResponse | null> {
    try {
      const res = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getAidsAndNutrition()

      if (!res) {
        return null
      }
      const nutrition =
        res.nutrition
          ?.map((c) => generateAidOrNutrition(c, AidOrNutritionType.NUTRITION))
          .filter(isDefined) ?? []

      const aids =
        res.aids
          ?.map((c) => generateAidOrNutrition(c, AidOrNutritionType.AID))
          .filter(isDefined) ?? []

      return {
        data: [...aids, ...nutrition],
        totalCount: aids?.length,
        pageInfo: {
          hasNextPage: false,
        },
      }
    } catch (e) {
      return handle404(e)
    }
  }

  async postRenewAidsOrNutrition(
    user: User,
    id: string,
  ): Promise<Renew | null> {
    try {
      const numberId = Number(id)
      if (isNaN(numberId)) {
        return null
      }
      const res = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .renewAidOrNutrition({ id: numberId })

      if (!res) {
        return null
      }

      return {
        errorMessage: res.errorMessage ?? undefined,
        success: res.success ?? undefined,
        requestId: res.requestId ?? undefined,
      }
    } catch (e) {
      return handle404(e)
    }
  }
}
