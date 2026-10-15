import { Injectable } from '@nestjs/common'

import type { Auth, User as AuthUser } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'

import { Discount, Flight, User, UsersApi } from '../../gen/fetch'

@Injectable()
export class AirDiscountSchemeClientService {
  constructor(private usersApi: UsersApi) {}

  private usersApiWithAuth(auth: Auth) {
    return this.usersApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  private handle4xx = (error: unknown): null => {
    if (
      error instanceof FetchError &&
      (error.status === 403 || error.status === 404)
    ) {
      return null
    }
    throw error
  }

  getCurrentDiscount(
    auth: AuthUser,
    nationalId: string,
  ): Promise<Discount | null> {
    return this.usersApiWithAuth(auth)
      .privateDiscountControllerGetCurrentDiscountByNationalId({ nationalId })
      .catch((error) => {
        // The backend responds with an empty body when there is no discount
        if (error instanceof Error && error.message.includes('invalid json')) {
          return null
        }
        return this.handle4xx(error)
      })
  }

  createDiscount(auth: AuthUser, nationalId: string): Promise<Discount | null> {
    return this.usersApiWithAuth(auth)
      .privateDiscountControllerCreateDiscountCode({ nationalId })
      .catch(this.handle4xx)
  }

  async getUserRelations(auth: AuthUser): Promise<User[]> {
    const relations = await this.usersApiWithAuth(auth)
      .privateUserControllerGetUserRelations({ nationalId: auth.nationalId })
      .catch(this.handle4xx)

    return relations ?? []
  }

  async getUserAndRelationsFlights(auth: AuthUser): Promise<Flight[]> {
    const flights = await this.usersApiWithAuth(auth)
      .privateFlightUserControllerGetUserAndRelationsFlights()
      .catch(this.handle4xx)

    return flights ?? []
  }
}
