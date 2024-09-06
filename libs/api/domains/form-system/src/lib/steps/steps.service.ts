import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
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
import { handle4xx } from '../../utils/errorHandler'

@Injectable()
export class StepsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private formsApi: StepsApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'steps-service',
    }
    this.logger.error(errorDetail || 'Error in steps service', err)

    throw new ApolloError(error.message)
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
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to get step from Id'),
      )
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
      .catch((e) => handle4xx(e, this.handleError, 'failed to post step'))

    if (!response || response instanceof ApolloError) {
      return {}
    }
    return response as Step
  }

  async deleteStep(auth: User, input: DeleteStepInput): Promise<void> {
    const request: ApiStepsStepIdDeleteRequest = {
      stepId: input.stepId,
    }

    await this.stepsApiWithAuth(auth)
      .apiStepsStepIdDelete(request)
      .catch((e) => handle4xx(e, this.handleError, 'failed to delete step'))

    return
  }

  async updateStep(auth: User, input: UpdateStepInput): Promise<void> {
    const request: ApiStepsStepIdPutRequest = {
      stepId: input.stepId,
      stepUpdateDto: input.stepUpdateDto,
    }

    await this.stepsApiWithAuth(auth)
      .apiStepsStepIdPut(request)
      .catch((e) => handle4xx(e, this.handleError, 'failed to update step'))

    return
  }
}
