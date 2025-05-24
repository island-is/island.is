import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import {
  FormApplicantTypesApi,
  FormApplicantTypesControllerCreateRequest,
  FormApplicantTypesControllerDeleteRequest,
  FormApplicantTypesControllerUpdateRequest,
} from '@island.is/clients/form-system'
import {
  FormApplicantTypeDeleteInput,
  FormApplicantTypeCreateInput,
  FormApplicantTypeUpdateInput,
} from '../../dto/formApplicantType.input'
import { FormApplicantType } from '../../models/formApplicantTypes.model'

@Injectable()
export class FormApplicantTypesService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private formApplicantTypesApi: FormApplicantTypesApi,
  ) { }

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(
      errorDetail || 'Error in form applicant types service',
      err,
    )
    throw new ApolloError(error.message)
  }

  private formApplicantTypesApiWithAuth(auth: User) {
    return this.formApplicantTypesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createFormApplicantType(
    auth: User,
    input: FormApplicantTypeCreateInput,
  ): Promise<FormApplicantType> {
    const response = await this.formApplicantTypesApiWithAuth(
      auth,
    ).formApplicantTypesControllerCreate(
      input as FormApplicantTypesControllerCreateRequest,
    )

    return response as FormApplicantType
  }

  async deleteFormApplicantType(
    auth: User,
    input: FormApplicantTypeDeleteInput,
  ): Promise<void> {
    await this.formApplicantTypesApiWithAuth(
      auth,
    ).formApplicantTypesControllerDelete(
      input as FormApplicantTypesControllerDeleteRequest,
    )
  }

  async updateFormApplicantType(
    auth: User,
    input: FormApplicantTypeUpdateInput,
  ): Promise<void> {
    await this.formApplicantTypesApiWithAuth(
      auth,
    ).formApplicantTypesControllerUpdate(
      input as FormApplicantTypesControllerUpdateRequest,
    )
  }
}
