import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  FormCertificationTypeDto,
  FormCertificationTypesApi,
  FormCertificationTypesControllerCreateRequest,
  OrganizationCertificationTypesControllerCreateRequest,
  FormCertificationTypesControllerDeleteRequest,
  OrganizationCertificationTypeDto,
  OrganizationCertificationTypesApi,
} from '@island.is/clients/form-system'
import {
  CreateCertificationInput,
  DeleteCertificationInput,
  OrganizationCertificationTypeCreateInput,
} from '../../dto/certification.input'

@Injectable()
export class CertificationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private certificationsApi: FormCertificationTypesApi,
    private organizationCertificationsApi: OrganizationCertificationTypesApi,
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

  private certificationsApiWithAuth(auth: User) {
    return this.certificationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private organizationCertificationsApiWithAuth(auth: User) {
    return this.organizationCertificationsApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  async createCertification(
    auth: User,
    input: CreateCertificationInput,
  ): Promise<FormCertificationTypeDto> {
    const response = await this.certificationsApiWithAuth(auth)
      .formCertificationTypesControllerCreate(
        input as FormCertificationTypesControllerCreateRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to create certification'),
      )

    if (!response || response instanceof ApolloError) {
      return {
        id: '',
        certificationTypeId: '',
      }
    }
    return response
  }

  async deleteCertification(
    auth: User,
    input: DeleteCertificationInput,
  ): Promise<void> {
    await this.certificationsApiWithAuth(auth)
      .formCertificationTypesControllerDelete(
        input as FormCertificationTypesControllerDeleteRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to delete certification'),
      )
  }

  async createOrganizationCertification(
    auth: User,
    input: OrganizationCertificationTypeCreateInput,
  ): Promise<OrganizationCertificationTypeDto> {
    const response = await this.organizationCertificationsApiWithAuth(auth)
      .organizationCertificationTypesControllerCreate(
        input as OrganizationCertificationTypesControllerCreateRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to create certification'),
      )

    if (!response || response instanceof ApolloError) {
      return {
        id: '',
        certificationTypeId: '',
      }
    }
    return response
  }
}
