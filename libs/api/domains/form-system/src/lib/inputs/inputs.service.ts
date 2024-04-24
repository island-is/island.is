import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { ApolloError } from '@apollo/client'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  InputsApi,
  ApiInputsInputIdGetRequest,
  ApiInputsPostRequest,
  ApiInputsInputIdDeleteRequest,
  ApiInputsInputIdPutRequest,
  InputCreationDto,
  InputUpdateDto,
} from '@island.is/clients/form-system'
import {
  GetInputInput,
  CreateInputInput,
  DeleteInputInput,
  UpdateInputInput,
} from '../../dto/inputs.input'
import { Input } from '../../models/input.model'
// import { graphql } from "graphql"
// import { RESTInputSettings, graphqlToRestInputSettings, restToGraphqlInputSettings } from "../utils/helperFunctions"
// import { InputSettings } from "../../models/inputSettings.model"

@Injectable()
export class InputsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private formsApi: InputsApi,
  ) {}

  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'inputs-service',
    }
    this.logger.error(errorDetail || 'Error in inputs service', err)

    throw new ApolloError(error.message)
  }

  private handle4xx(error: any, errorDetail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, errorDetail)
  }

  private inputsApiWithAuth(auth: User) {
    return this.formsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getInput(auth: User, input: GetInputInput): Promise<Input> {
    const request: ApiInputsInputIdGetRequest = {
      inputId: input.id,
    }
    const response = await this.inputsApiWithAuth(auth)
      .apiInputsInputIdGet(request)
      .catch((e) => this.handle4xx(e, 'failed to get input from Id'))
    if (!response || response instanceof ApolloError) {
      return {}
    }
    // return {
    //   ...response,
    //   inputSettings: restToGraphqlInputSettings(response.inputSettings as RESTInputSettings)
    // } as Input
    return response as Input
  }

  async postInput(auth: User, input: CreateInputInput): Promise<Input> {
    const request: ApiInputsPostRequest = {
      inputCreationDto: input.inputCreationDto as InputCreationDto,
    }
    const response = await this.inputsApiWithAuth(auth)
      .apiInputsPost(request)
      .catch((e) => this.handle4xx(e, 'failed to post input'))

    if (!response || response instanceof ApolloError) {
      return {}
    }
    return response as Input
  }

  async deleteInput(auth: User, input: DeleteInputInput): Promise<void> {
    const request: ApiInputsInputIdDeleteRequest = {
      inputId: input.inputId,
    }

    const response = await this.inputsApiWithAuth(auth)
      .apiInputsInputIdDelete(request)
      .catch((e) => this.handle4xx(e, 'failed to delete input'))

    if (!response || response instanceof ApolloError) {
      return void 0
    }
    return response
  }

  async updateInput(auth: User, input: UpdateInputInput): Promise<void> {
    let request: ApiInputsInputIdPutRequest = {
      inputId: input.inputId,
      inputUpdateDto: input.inputUpdateDto as InputUpdateDto,
    }
    if (input.inputUpdateDto) {
      request = {
        inputId: input.inputId,
        inputUpdateDto: input.inputUpdateDto,
      }
    }
    const response = await this.inputsApiWithAuth(auth)
      .apiInputsInputIdPut(request)
      .catch((e) => this.handle4xx(e, 'failed to update input'))

    if (!response || response instanceof ApolloError) {
      return void 0
    }
    return response
  }
}
