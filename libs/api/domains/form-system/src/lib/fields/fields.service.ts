import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  FieldsApi,
  FieldsControllerCreateRequest,
  FieldsControllerDeleteRequest,
  FieldsControllerUpdateRequest,
  FieldDisplayOrderDto,
} from '@island.is/clients/form-system'
import {
  CreateFieldInput,
  DeleteFieldInput,
  UpdateFieldInput,
  UpdateFieldsDisplayOrderInput,
} from '../../dto/field.input'
import { Field } from '../../models/field.model'

@Injectable()
export class FieldsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private fieldsApi: FieldsApi,
  ) { }

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in fields service', err)
    throw new ApolloError(error.message)
  }

  private fieldsApiWithAuth(auth: User) {
    return this.fieldsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createField(auth: User, input: CreateFieldInput): Promise<Field> {
    const response = await this.fieldsApiWithAuth(auth)
      .fieldsControllerCreate(input as FieldsControllerCreateRequest)
      .catch((e) => handle4xx(e, this.handleError, 'failed to create field'))

    if (!response || response instanceof ApolloError) {
      if (!(response instanceof ApolloError)) {
        throw new ApolloError({ errorMessage: JSON.stringify(response) })
      }
      throw response
    }

    return response
  }

  async deleteField(auth: User, input: DeleteFieldInput): Promise<void> {
    const response = await this.fieldsApiWithAuth(auth)
      .fieldsControllerDelete(input as FieldsControllerDeleteRequest)
      .catch((e) => handle4xx(e, this.handleError, 'failed to delete field'))

    if (!response || response instanceof ApolloError) {
      return
    }
    return response
  }

  async updateField(auth: User, input: UpdateFieldInput): Promise<void> {
    const response = await this.fieldsApiWithAuth(auth)
      .fieldsControllerUpdate(input as unknown as FieldsControllerUpdateRequest)
      .catch((e) => handle4xx(e, this.handleError, 'failed to update field'))
    if (!response || response instanceof ApolloError) {
      return
    }
    return response
  }

  async updateFieldsDisplayOrder(
    auth: User,
    input: UpdateFieldsDisplayOrderInput,
  ): Promise<void> {
    const response = await this.fieldsApiWithAuth(auth)
      .fieldsControllerUpdateDisplayOrder({
        updateFieldsDisplayOrderDto: {
          fieldsDisplayOrderDto:
            input.updateFieldsDisplayOrderDto as FieldDisplayOrderDto[],
        },
      })
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to update field display order'),
      )

    if (!response || response instanceof ApolloError) {
      return
    }
    return response
  }
}
