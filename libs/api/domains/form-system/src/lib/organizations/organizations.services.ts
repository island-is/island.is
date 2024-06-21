import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { ApolloError } from '@apollo/client'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  ApiOrganizationsPostRequest,
  OrganizationsApi,
} from '@island.is/clients/form-system'
import { CreateOrganizationInput } from '../../dto/organization.input'
import { Organization } from '../../models/organization.model'
import { handle4xx } from '../../utils/errorHandler'

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private organizationsApi: OrganizationsApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'organizations-service',
    }
    this.logger.error(errorDetail || 'Error in organizations service', err)

    throw new ApolloError(error.message)
  }

  private organizationsApiWithAuth(auth: User) {
    return this.organizationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async postOrganization(
    auth: User,
    input: CreateOrganizationInput,
  ): Promise<Organization> {
    const request: ApiOrganizationsPostRequest = {
      organizationCreationDto: {
        name: input.name,
        nationalId: input.nationalId,
      },
    }

    const response = await this.organizationsApiWithAuth(auth)
      .apiOrganizationsPost(request)
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to post organization'),
      )

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response
  }
}
