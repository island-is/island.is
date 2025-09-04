import { Injectable } from '@nestjs/common'
import { BloodApi } from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { BloodTypeDto, mapBloodTypeDto } from './dtos/bloodTypes.dto'
import { handle404 } from '@island.is/clients/middlewares'
import { Form, PatientPropertiesApi } from './questionnaries-temp/gen/fetch'

@Injectable()
export class LshClientService {
  constructor(
    private readonly api: BloodApi,
    private readonly questionnariesApi: PatientPropertiesApi,
  ) {}

  private bloodTypeWithAuth(auth: Auth) {
    return this.api.withMiddleware(new AuthMiddleware(auth))
  }

  private questionnariesWithAuth(auth: Auth) {
    return this.questionnariesApi.withMiddleware(new AuthMiddleware(auth))
  }

  getBloodType = async (
    user: User,
    locale: string,
  ): Promise<BloodTypeDto | null> => {
    const bloodType = await this.bloodTypeWithAuth(user)
      .apiBloodGet({ locale: locale })
      .catch(handle404)

    if (!bloodType) {
      return null
    }

    return mapBloodTypeDto(bloodType)
  }

  getQuestionnaries = async (
    user: User,
    locale: string,
  ): Promise<Form[] | null> => {
    return this.questionnariesWithAuth(user)
      .apiV2PatientPropertiesGetFormListGet()
      .catch(handle404)
  }
}
