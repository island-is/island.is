import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import {
  FormCertificationTypeDto,
  FormCertificationTypesApi,
  FormCertificationTypesControllerCreateRequest,
  FormCertificationTypesControllerDeleteRequest,
} from '@island.is/clients/form-system'
import {
  CreateCertificationInput,
  DeleteCertificationInput,
} from '../../dto/certification.input'

@Injectable()
export class CertificationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private certificationsApi: FormCertificationTypesApi,
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

  async createCertification(
    auth: User,
    input: CreateCertificationInput,
  ): Promise<FormCertificationTypeDto> {
    const response = await this.certificationsApiWithAuth(
      auth,
    ).formCertificationTypesControllerCreate(
      input as FormCertificationTypesControllerCreateRequest,
    )

    return response as FormCertificationTypeDto
  }

  async deleteCertification(
    auth: User,
    input: DeleteCertificationInput,
  ): Promise<void> {
    await this.certificationsApiWithAuth(
      auth,
    ).formCertificationTypesControllerDelete(
      input as FormCertificationTypesControllerDeleteRequest,
    )
  }
}
