import { Inject, Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  AdminApi,
  AdminDevApi,
  AdminProdApi,
  AdminStagingApi,
} from '@island.is/clients/auth/admin-api'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Environment } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { environments } from '../constants/environments'

@Injectable()
export abstract class MultiEnvironmentService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    protected readonly logger: Logger,
    @Inject(AdminDevApi.key)
    private readonly adminDevApi?: AdminApi,
    @Inject(AdminStagingApi.key)
    private readonly adminStagingApi?: AdminApi,
    @Inject(AdminProdApi.key)
    private readonly adminProdApi?: AdminApi,
  ) {
    if (!this.adminDevApi && !this.adminStagingApi && !this.adminProdApi) {
      logger.error(
        'No admin api clients configured, at least one configured api is required.',
      )
    }
  }

  protected adminDevApiWithAuth(auth: Auth) {
    return this.adminDevApi?.withMiddleware(new AuthMiddleware(auth))
  }
  protected adminStagingApiWithAuth(auth: Auth) {
    return this.adminStagingApi?.withMiddleware(new AuthMiddleware(auth))
  }
  protected adminProdApiWithAuth(auth: Auth) {
    return this.adminProdApi?.withMiddleware(new AuthMiddleware(auth))
  }

  protected adminApiByEnvironmentWithAuth(
    environment: Environment,
    auth: Auth,
  ) {
    switch (environment) {
      case Environment.Development:
        return this.adminDevApiWithAuth(auth)
      case Environment.Staging:
        return this.adminStagingApiWithAuth(auth)
      case Environment.Production:
        return this.adminProdApiWithAuth(auth)
      default:
        return null
    }
  }

  protected handleError(error: Error, environment: Environment) {
    this.logger.error(`Error while fetching data from ${environment}`, error)

    // We swallow the errors
    return undefined
  }

  /**
   * Generic method for handling settled promises
   * The method will resolve the fulfilled promises and log errors for rejected promises
   * The return value of the fulfilled promises are mapped with the given mapper function
   */
  public handleSettledPromises<T, K>(
    settledPromises: PromiseSettledResult<T | undefined>[],
    {
      mapper,
      prefixErrorMessage,
    }: {
      mapper: (value: PromiseFulfilledResult<T>['value'], index: number) => K
      prefixErrorMessage?: string
    },
  ): K[] {
    return settledPromises
      .map((resp, index) => {
        if (resp.status === 'fulfilled' && resp.value) {
          return mapper(resp.value, index)
        } else if (resp.status === 'rejected') {
          this.logger.error(
            `${prefixErrorMessage ?? 'Error'} in environment ${
              environments[index]
            }`,
            resp.reason,
          )
        }
      })
      .filter(isDefined)
  }
}
