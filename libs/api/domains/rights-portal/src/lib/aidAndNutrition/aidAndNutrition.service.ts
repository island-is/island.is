import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { AidsandnutritionApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import {
  AidOrNutritionType,
  generateAidOrNutrition,
} from './utils/generateAidOrNutrition'
import { PaginatedAidAndNutritionResponse } from './models/aidAndNutrition.model'
import { handle404 } from '@island.is/clients/middlewares'

const LOG_CATEGORY = 'rights-portal-aids-and-nutrition'
@Injectable()
export class AidAndNutritionService {
  constructor(
    private api: AidsandnutritionApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getAidAndNutrition(
    user: User,
  ): Promise<PaginatedAidAndNutritionResponse | null> {
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
      this.logger.error('Failed to get aids and nutrition', {
        ...e,
        category: LOG_CATEGORY,
      })
      return handle404(e)
    }
  }
}
