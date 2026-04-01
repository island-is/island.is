import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import {
  OrganizationsApi,
  OrganizationsControllerFindAdminRequest,
} from '@island.is/clients/form-system'
import { GetOrganizationAdminInput } from '../../dto/organization.input'
import { OrganizationAdmin } from '../../models/organizationAdmin.model'

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
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in organizations service', err)

    throw new ApolloError(error.message)
  }

  private organizationsApiWithAuth(auth: User) {
    return this.organizationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getOrganizationAdmin(
    auth: User,
    input: GetOrganizationAdminInput,
  ): Promise<OrganizationAdmin> {
    const response = await this.organizationsApiWithAuth(
      auth,
    ).organizationsControllerFindAdmin(
      input as OrganizationsControllerFindAdminRequest,
    )

    return response as OrganizationAdmin
  }
}
