import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import {
  ApiStepsPostRequest,
  ApiStepsStepIdDeleteRequest,
  ApiStepsStepIdGetRequest,
  ApiStepsStepIdPutRequest,
  StepsApi,
} from '@island.is/clients/form-system'
import { ApolloError } from '@apollo/client'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  CreateStepInput,
  DeleteStepInput,
  GetStepInput,
  UpdateStepInput,
} from '../../dto/steps.input'
import { Step } from '../../models/step.model'

@Injectable()
export class StepsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private formsApi: StepsApi,
  ) {}

  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'steps-service',
    }
    this.logger.error(errorDetail || 'Error in steps service', err)

    throw new ApolloError(error.message)
  }

  private handle4xx(error: any, errorDetail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, errorDetail)
  }

  private stepsApiWithAuth(auth: User) {
    return this.formsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getStep(auth: User, input: GetStepInput): Promise<Step> {
    const request: ApiStepsStepIdGetRequest = {
      stepId: input.id,
    }
    const response = await this.stepsApiWithAuth(auth)
      .apiStepsStepIdGet(request)
      .catch((e) => this.handle4xx(e, 'failed to get step from Id'))
    if (!response || response instanceof ApolloError) {
      return {}
    }
    return response as Step
  }

  async postStep(auth: User, input: CreateStepInput): Promise<Step> {
    const request: ApiStepsPostRequest = {
      stepCreationDto: input.stepCreationDto,
    }
    const response = await this.stepsApiWithAuth(auth)
      .apiStepsPost(request)
      .catch((e) => this.handle4xx(e, 'failed to post step'))

    if (!response || response instanceof ApolloError) {
      return {}
    }
    return response as Step
  }

  async deleteStep(auth: User, input: DeleteStepInput): Promise<void> {
    const request: ApiStepsStepIdDeleteRequest = {
      stepId: input.stepId,
    }

    const response = await this.stepsApiWithAuth(auth)
      .apiStepsStepIdDelete(request)
      .catch((e) => this.handle4xx(e, 'failed to delete step'))

    if (!response || response instanceof ApolloError) {
      return void 0
    }
    return response
  }

  async updateStep(auth: User, input: UpdateStepInput): Promise<void> {
    const request: ApiStepsStepIdPutRequest = {
      stepId: input.stepId,
      stepUpdateDto: input.stepUpdateDto,
    }

    const response = await this.stepsApiWithAuth(auth)
      .apiStepsStepIdPut(request)
      .catch((e) => this.handle4xx(e, 'failed to update step'))

    if (!response || response instanceof ApolloError) {
      return void 0
    }
    return response
  }
}
