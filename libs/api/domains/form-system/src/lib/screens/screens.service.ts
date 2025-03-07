import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  ScreensApi,
  ScreensControllerCreateRequest,
  ScreensControllerDeleteRequest,
  ScreensControllerUpdateDisplayOrderRequest,
  ScreensControllerUpdateRequest,
} from '@island.is/clients/form-system'
import {
  CreateScreenInput,
  DeleteScreenInput,
  UpdateScreenInput,
  UpdateScreensDisplayOrderInput,
} from '../../dto/screen.input'
import { Screen } from '../../models/screen.model'

@Injectable()
export class ScreensService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private screensApi: ScreensApi,
  ) { }

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in screens service', err)

    throw new ApolloError(error.message)
  }

  private screensApiWithAuth(auth: User) {
    return this.screensApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createScreen(auth: User, input: CreateScreenInput): Promise<Screen> {
    const response = await this.screensApiWithAuth(auth)
      .screensControllerCreate(input as ScreensControllerCreateRequest)
      .catch((e) => handle4xx(e, this.handleError, 'failed to create screen'))

    return response
  }

  async deleteScreen(auth: User, input: DeleteScreenInput): Promise<void> {
    const response = await this.screensApiWithAuth(auth)
      .screensControllerDelete(input as ScreensControllerDeleteRequest)
      .catch((e) => handle4xx(e, this.handleError, 'failed to delete screen'))

    if (!response || response instanceof ApolloError) {
      return
    }
  }

  async updateScreen(auth: User, input: UpdateScreenInput): Promise<Screen> {
    const response = await this.screensApiWithAuth(auth)
      .screensControllerUpdate(input as ScreensControllerUpdateRequest)
      .catch((e) => handle4xx(e, this.handleError, 'failed to update screen'))

    return response
  }

  async updateScreensDisplayOrder(
    auth: User,
    input: UpdateScreensDisplayOrderInput,
  ): Promise<void> {
    const response = await this.screensApiWithAuth(auth)
      .screensControllerUpdateDisplayOrder(
        input as ScreensControllerUpdateDisplayOrderRequest,
      )
      .catch((e) => handle4xx(e, this.handleError, 'failed to update screen'))

    return
  }
}
