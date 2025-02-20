import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  FormCertificationTypeDto,
  FormCertificationTypesApi,
  FormCertificationTypesControllerCreateRequest,
  FormCertificationTypesControllerDeleteRequest,
} from '@island.is/clients/form-system'
import {
  CreateFormCertificationTypeInput,
  DeleteFormCertificationTypeInput,
} from '@island.is/form-system-dto'

@Injectable()
export class FormCertificationTypesService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private formCertificationTypesApi: FormCertificationTypesApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(
      errorDetail || 'Error in form certification types service',
      err,
    )

    throw new ApolloError(error.message)
  }

  private formCertificationTypesApiWithAuth(auth: User) {
    return this.formCertificationTypesApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  async createFormCertificationType(
    auth: User,
    input: CreateFormCertificationTypeInput,
  ): Promise<FormCertificationTypeDto> {
    const response = await this.formCertificationTypesApiWithAuth(auth)
      .formCertificationTypesControllerCreate(
        input as FormCertificationTypesControllerCreateRequest,
      )
      .catch((e) =>
        handle4xx(
          e,
          this.handleError,
          'failed to create form certification type',
        ),
      )

    if (!response || response instanceof ApolloError) {
      return {
        id: '',
        certificationTypeId: '',
      }
    }
    return response
  }

  async deleteFormCertificationType(
    auth: User,
    input: DeleteFormCertificationTypeInput,
  ): Promise<void> {
    await this.formCertificationTypesApiWithAuth(auth)
      .formCertificationTypesControllerDelete(
        input as FormCertificationTypesControllerDeleteRequest,
      )
      .catch((e) =>
        handle4xx(
          e,
          this.handleError,
          'failed to delete form certification type',
        ),
      )
  }
}
