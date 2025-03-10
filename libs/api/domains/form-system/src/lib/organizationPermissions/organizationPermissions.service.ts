import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  FormCertificationTypeDto,
  FormCertificationTypesApi,
  FormCertificationTypesControllerCreateRequest,
  // OrganizationCertificationTypesControllerCreateRequest,
  FormCertificationTypesControllerDeleteRequest,
  // OrganizationCertificationTypeDto,
  // OrganizationCertificationTypesApi,
  // OrganizationCertificationTypesControllerDeleteRequest,
  OrganizationPermissionDto,
  OrganizationPermissionsControllerDeleteRequest,
  OrganizationPermissionsControllerCreateRequest,
  OrganizationPermissionsApi,
} from '@island.is/clients/form-system'
import {
  CreateCertificationInput,
  DeleteCertificationInput,
  // OrganizationCertificationTypeUpdateInput,
  // OrganizationPermissionUpdateInput,
} from '../../dto/certification.input'
import { OrganizationPermissionUpdateInput } from '../../dto/organizationPermission.input'

@Injectable()
export class OrganizationPermissionsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    // private certificationsApi: FormCertificationTypesApi,
    private organizationPermissionsApi: OrganizationPermissionsApi, // private organizationCertificationsApi: OrganizationCertificationTypesApi,
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

  // private certificationsApiWithAuth(auth: User) {
  //   return this.certificationsApi.withMiddleware(new AuthMiddleware(auth))
  // }

  private organizationPermissionsApiWithAuth(auth: User) {
    return this.organizationPermissionsApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  async createOrganizationPermission(
    auth: User,
    input: OrganizationPermissionUpdateInput,
  ): Promise<OrganizationPermissionDto> {
    const response = await this.organizationPermissionsApiWithAuth(auth)
      .organizationPermissionsControllerCreate(
        input as OrganizationPermissionsControllerCreateRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to create permission'),
      )

    if (!response || response instanceof ApolloError) {
      return {
        permission: '',
      }
    }
    return response
  }

  async deleteOrganizationPermission(
    auth: User,
    input: OrganizationPermissionUpdateInput,
  ): Promise<void> {
    await this.organizationPermissionsApiWithAuth(auth)
      .organizationPermissionsControllerDelete(
        input as OrganizationPermissionsControllerDeleteRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to delete permission'),
      )
  }
}
