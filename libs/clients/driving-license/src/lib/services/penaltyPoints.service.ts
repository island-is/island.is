import { Injectable } from '@nestjs/common'
import {
  ApiV5,
  DRIVING_LICENSE_API_VERSION_V5,
  DtoV5DeprivationDto,
} from '@/v5'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class PenaltyPointsService {
  constructor(private readonly api: ApiV5) {}

  private serviceWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  //TODO: stop sending tokens around, it's not needed since its't in the request itself

  public async penaltyPointsDrivingLicenseApplicationIsBelowThreshold(
    user: User,
  ): Promise<boolean> {
    //TODO: Fix this, shouldnt be sending tokens as a request parameter
    const { ok } = await this.serviceWithAuth(
      user,
    ).apiDrivinglicenseV5PenaltypointsGet({
      apiVersion: DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: user.authorization,
    })

    return ok
  }

  public async deprivations(user: User): Promise<Array<DtoV5DeprivationDto>> {
    return this.serviceWithAuth(user).apiDrivinglicenseV5DeprivationsGet({
      apiVersion: DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: user.authorization,
    })
  }
}
