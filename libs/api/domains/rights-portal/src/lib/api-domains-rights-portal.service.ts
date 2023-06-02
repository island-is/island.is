import { Injectable } from '@nestjs/common'
import {
  AidsandnutritionApi,
  TherapyApi,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class RightsPortalService {
  constructor(
    private therapyApi: TherapyApi,
    private aidsAndNutritionApi: AidsandnutritionApi,
  ) {}
  getTherapies = (user: User) =>
    this.therapyApi
      .withMiddleware(new AuthMiddleware(user as Auth))
      .therapies()
      .catch(handle404)

  getAidsAndNutrition = (user: User) =>
    this.aidsAndNutritionApi
      .withMiddleware(new AuthMiddleware(user as Auth))
      .aidsandnutrition()
      .catch(handle404)
}
