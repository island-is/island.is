import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import {
  OrganizationPermissionDto,
  OrganizationPermissionsControllerDeleteRequest,
  OrganizationPermissionsControllerCreateRequest,
  OrganizationPermissionsApi,
} from '@island.is/clients/form-system'
import { OrganizationPermissionUpdateInput } from '../../dto/organizationPermission.input'

@Injectable()
export class OrganizationPermissionsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private organizationPermissionsApi: OrganizationPermissionsApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in certifications service', err)

    throw new ApolloError(error.message)
  }

  private organizationPermissionsApiWithAuth(auth: User) {
    return this.organizationPermissionsApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  async createOrganizationPermission(
    auth: User,
    input: OrganizationPermissionUpdateInput,
  ): Promise<OrganizationPermissionDto> {
    const response = await this.organizationPermissionsApiWithAuth(
      auth,
    ).organizationPermissionsControllerCreate(
      input as OrganizationPermissionsControllerCreateRequest,
    )

    return response as OrganizationPermissionDto
  }

  async deleteOrganizationPermission(
    auth: User,
    input: OrganizationPermissionUpdateInput,
  ): Promise<void> {
    await this.organizationPermissionsApiWithAuth(
      auth,
    ).organizationPermissionsControllerDelete(
      input as OrganizationPermissionsControllerDeleteRequest,
    )
  }
}
