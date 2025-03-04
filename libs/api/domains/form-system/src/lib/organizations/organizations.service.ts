import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  OrganizationsApi,
  OrganizationsControllerCreateRequest,
  OrganizationsControllerFindOneRequest,
} from '@island.is/clients/form-system'
import { GetOrganizationInput } from '../../dto/organization.input'
import { Organization } from '../../models/organization.model'

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private organizationsApi: OrganizationsApi,
  ) { }

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in organizations service', err)

    throw new ApolloError(error.message)
  }

  private organizationsApiWithAuth(auth: User) {
    return this.organizationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createOrganization(
    auth: User,
    input: GetOrganizationInput,
  ): Promise<Organization> {
    const response = await this.organizationsApiWithAuth(auth)
      .organizationsControllerCreate(
        input as OrganizationsControllerCreateRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to create organization'),
      )

    if (!response || response instanceof ApolloError) {
      if (!(response instanceof ApolloError)) {
        throw new ApolloError({ errorMessage: JSON.stringify(response) })
      }
      throw response
    }

    return response as Organization
  }

  async getOrganization(
    auth: User,
    input: GetOrganizationInput,
  ): Promise<Organization> {
    const response = await this.organizationsApiWithAuth(auth)
      .organizationsControllerFindOne(
        input as OrganizationsControllerFindOneRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to get organizations'),
      )

    if (!response || response instanceof ApolloError) {
      if (!(response instanceof ApolloError)) {
        throw new ApolloError({ errorMessage: JSON.stringify(response) })
      }
      throw response
    }

    return response as Organization
  }
}
