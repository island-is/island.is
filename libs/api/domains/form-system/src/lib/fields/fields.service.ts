import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
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
  ) {}

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
    const response = await this.fieldsApiWithAuth(auth).fieldsControllerCreate(
      input as FieldsControllerCreateRequest,
    )
    return response
  }

  async deleteField(auth: User, input: DeleteFieldInput): Promise<void> {
    await this.fieldsApiWithAuth(auth).fieldsControllerDelete(
      input as FieldsControllerDeleteRequest,
    )
  }

  async updateField(auth: User, input: UpdateFieldInput): Promise<void> {
    await this.fieldsApiWithAuth(auth).fieldsControllerUpdate(
      input as unknown as FieldsControllerUpdateRequest,
    )
  }

  async updateFieldsDisplayOrder(
    auth: User,
    input: UpdateFieldsDisplayOrderInput,
  ): Promise<void> {
    await this.fieldsApiWithAuth(auth).fieldsControllerUpdateDisplayOrder({
      updateFieldsDisplayOrderDto: {
        fieldsDisplayOrderDto:
          input.updateFieldsDisplayOrderDto as FieldDisplayOrderDto[],
      },
    })
  }
}
