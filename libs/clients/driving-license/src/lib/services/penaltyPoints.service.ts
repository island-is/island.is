import { Injectable } from '@nestjs/common'
import {
  ApiV5,
  DRIVING_LICENSE_API_VERSION_V5,
  DtoV5DeprivationDto,
  DtoV5PenaltyPointDetailDto,
} from '../../v5'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle204 } from '@island.is/clients/middlewares'

@Injectable()
export class PenaltyPointsClientService {
  constructor(private readonly api: ApiV5) {}

  private serviceWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  parseJwtToken = (user: User) => user.authorization.slice(7)

  //TODO: stop sending tokens around, it's not needed since its't in the request itself
  public async penaltyPointsDrivingLicenseApplicationIsBelowThreshold(
    user: User,
  ): Promise<boolean | undefined> {
    //TODO: Fix this, shouldnt be sending tokens as a request parameter
    const result = await handle204(
      this.serviceWithAuth(user).apiDrivinglicenseV5PenaltypointsGetRaw({
        apiVersion: DRIVING_LICENSE_API_VERSION_V5,
        apiVersion2: DRIVING_LICENSE_API_VERSION_V5,
        jwttoken: this.parseJwtToken(user),
      }),
    )

    return result?.ok
  }

  public async deprivations(user: User): Promise<Array<DtoV5DeprivationDto>> {
    return this.serviceWithAuth(user).apiDrivinglicenseV5DeprivationsGet({
      apiVersion: DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: this.parseJwtToken(user),
    })
  }

  public async penaltyPointDetails(
    user: User,
  ): Promise<Array<DtoV5PenaltyPointDetailDto>> {
    return this.serviceWithAuth(
      user,
    ).apiDrivinglicenseV5PenaltypointsDetailsGet({
      apiVersion: DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: this.parseJwtToken(user),
    })
  }
}
