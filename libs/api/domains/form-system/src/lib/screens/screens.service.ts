import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
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
  ) {}

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
    const response = await this.screensApiWithAuth(
      auth,
    ).screensControllerCreate(input as ScreensControllerCreateRequest)

    return response as Screen
  }

  async deleteScreen(auth: User, input: DeleteScreenInput): Promise<void> {
    await this.screensApiWithAuth(auth).screensControllerDelete(
      input as ScreensControllerDeleteRequest,
    )
  }

  async updateScreen(auth: User, input: UpdateScreenInput): Promise<Screen> {
    const response = await this.screensApiWithAuth(
      auth,
    ).screensControllerUpdate(input as ScreensControllerUpdateRequest)

    return response as unknown as Screen
  }

  async updateScreensDisplayOrder(
    auth: User,
    input: UpdateScreensDisplayOrderInput,
  ): Promise<void> {
    await this.screensApiWithAuth(auth).screensControllerUpdateDisplayOrder(
      input as ScreensControllerUpdateDisplayOrderRequest,
    )
  }
}
