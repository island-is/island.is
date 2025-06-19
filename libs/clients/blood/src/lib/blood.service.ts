import { Injectable } from '@nestjs/common'
import { BloodApi } from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { BloodTypeDto, mapBloodTypeDto } from './dtos/bloodTypes.dto'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class BloodClientService {
  constructor(private readonly api: BloodApi) {}

  private bloodTypeWithAuth(auth: Auth) {
    return this.api.withMiddleware(new AuthMiddleware(auth))
  }

  getBloodType = async (user: User): Promise<BloodTypeDto | null> => {
    const bloodType = await this.bloodTypeWithAuth(user)
      .apiBloodGet()
      .catch(handle404)

    if (!bloodType) {
      return null
    }

    return mapBloodTypeDto(bloodType)
  }
}
