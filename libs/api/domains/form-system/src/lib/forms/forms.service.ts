import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'

import {
  FormsApi,
  FormsControllerCreateRequest,
  FormsControllerDeleteRequest,
  FormsControllerFindAllRequest,
  FormsControllerFindOneRequest,
  FormsControllerUpdateFormRequest,
} from '@island.is/clients/form-system'
import {
  CreateFormInput,
  DeleteFormInput,
  GetFormInput,
  GetFormsInput,
  UpdateFormInput,
} from '../../dto/form.input'
import { UpdateFormResponse } from '@island.is/form-system/shared'
import { FormResponse } from '../../models/form.model'

@Injectable()
export class FormsService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private formsService: FormsApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in forms service.', err)

    throw new ApolloError(error.message)
  }

  private formsApiWithAuth(auth: User) {
    return this.formsService.withMiddleware(new AuthMiddleware(auth))
  }

  async createForm(auth: User, input: CreateFormInput): Promise<FormResponse> {
    const response = await this.formsApiWithAuth(auth).formsControllerCreate(
      input as FormsControllerCreateRequest,
    )

    return response as FormResponse
  }

  async deleteForm(auth: User, input: DeleteFormInput): Promise<void> {
    await this.formsApiWithAuth(auth).formsControllerDelete(
      input as FormsControllerDeleteRequest,
    )
  }

  async getForm(auth: User, input: GetFormInput): Promise<FormResponse> {
    const response = await this.formsApiWithAuth(auth).formsControllerFindOne(
      input as FormsControllerFindOneRequest,
    )

    return response as FormResponse
  }

  async getAllForms(auth: User, input: GetFormsInput): Promise<FormResponse> {
    const response = await this.formsApiWithAuth(auth).formsControllerFindAll(
      input as FormsControllerFindAllRequest,
    )

    return response as FormResponse
  }

  async updateForm(
    auth: User,
    input: UpdateFormInput,
  ): Promise<UpdateFormResponse> {
    const response = await this.formsApiWithAuth(
      auth,
    ).formsControllerUpdateForm(input as FormsControllerUpdateFormRequest)

    return response as UpdateFormResponse
  }
}
