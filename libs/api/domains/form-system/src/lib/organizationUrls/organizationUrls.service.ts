import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import {
  OrganizationUrlsApi,
  OrganizationUrlsControllerCreateRequest,
  OrganizationUrlsControllerDeleteRequest,
  OrganizationUrlsControllerUpdateRequest,
} from '@island.is/clients/form-system'
import { OrganizationUrl } from '../../models/organizationUrl.model'
import {
  CreateOrganizationUrlInput,
  DeleteOrganizationUrlInput,
  UpdateOrganizationUrlInput,
} from '../../dto/organizationUrl.input'

@Injectable()
export class OrganizationUrlsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private organizationUrlsApi: OrganizationUrlsApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in organization urls service', err)
    throw new ApolloError(error.message)
  }

  private organizationUrlsApiWithAuth(auth: User) {
    return this.organizationUrlsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createOrganizationUrl(
    auth: User,
    input: CreateOrganizationUrlInput,
  ): Promise<OrganizationUrl> {
    const response = await this.organizationUrlsApiWithAuth(
      auth,
    ).organizationUrlsControllerCreate({
      createOrganizationUrlDto: input,
    } as OrganizationUrlsControllerCreateRequest)
    return response
  }

  async deleteOrganizationUrl(
    auth: User,
    input: DeleteOrganizationUrlInput,
  ): Promise<void> {
    try {
      await this.organizationUrlsApiWithAuth(
        auth,
      ).organizationUrlsControllerDelete(
        input as OrganizationUrlsControllerDeleteRequest,
      )
    } catch (error) {
      this.handleError(error, 'Failed to delete organization URL')
    }
  }

  async updateOrganizationUrl(
    auth: User,
    input: UpdateOrganizationUrlInput,
  ): Promise<void> {
    try {
      await this.organizationUrlsApiWithAuth(
        auth,
      ).organizationUrlsControllerUpdate(
        input as OrganizationUrlsControllerUpdateRequest,
      )
    } catch (error) {
      this.handleError(error, 'Failed to update organization URL')
    }
  }
}
