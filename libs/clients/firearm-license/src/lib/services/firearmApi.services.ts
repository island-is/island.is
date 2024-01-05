import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import { Inject, Injectable } from '@nestjs/common'
import {
  FirearmApplicationApi,
  FirearmPropertyList,
  LicenseInfo,
} from '../../../gen/fetch'
import {
  FIREARM_APPLICATION_API,
  FirearmCategories,
  Result,
} from '../firearmApi.types'

@Injectable()
export class FirearmApi {
  constructor(
    @Inject(FIREARM_APPLICATION_API)
    private readonly api: FirearmApplicationApi,
  ) {}

  private handleError(e: Error): Result<null> {
    //404 - no license for user, still ok!
    let error
    if (e instanceof FetchError) {
      //404 - no license for user, still ok!
      if (e.status === 404) {
        return {
          ok: true,
          data: null,
        }
      } else {
        error = {
          code: 13,
          message: 'Service failure',
          data: JSON.stringify(e.body),
        }
      }
    } else {
      const unknownError = e as Error
      error = {
        code: 99,
        message: 'Unknown error',
        data: JSON.stringify(unknownError),
      }
    }

    return {
      ok: false,
      error,
    }
  }

  private firearmApiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  public async getLicenseInfo(user: User): Promise<Result<LicenseInfo | null>> {
    const licenseInfo: Result<LicenseInfo | null> =
      await this.firearmApiWithAuth(user)
        .apiFirearmApplicationLicenseInfoGet()
        .then((data) => {
          const result: Result<LicenseInfo> = {
            ok: true,
            data,
          }
          return result
        })
        .catch((e) => this.handleError(e))

    return licenseInfo
  }

  public async getPropertyInfo(
    user: User,
  ): Promise<Result<FirearmPropertyList | null>> {
    const propertyInfo: Result<FirearmPropertyList | null> =
      await this.firearmApiWithAuth(user)
        .apiFirearmApplicationPropertyInfoGet()
        .then((data) => {
          const result: Result<FirearmPropertyList> = {
            ok: true,
            data,
          }
          return result
        })
        .catch((e) => this.handleError(e))

    return propertyInfo
  }
  public async getCategories(
    user: User,
  ): Promise<Result<FirearmCategories | null>> {
    const categories = await this.firearmApiWithAuth(user)
      .apiFirearmApplicationCategoriesGet()
      .then((data) => {
        const result: Result<FirearmCategories> = {
          ok: true,
          data,
        }
        return result
      })
      .catch((e) => this.handleError(e))

    return categories
  }
}
