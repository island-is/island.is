import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import {
  FormUrlsApi,
  FormUrlsControllerCreateRequest,
  FormUrlsControllerDeleteRequest,
} from '@island.is/clients/form-system'
import { FormUrlDto } from '@island.is/form-system/shared'

@Injectable()
export class FormUrlsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private formUrlsApi: FormUrlsApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in form urls service', err)
    throw new ApolloError(error.message)
  }

  private formUrlsApiWithAuth(auth: User) {
    return this.formUrlsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createFormUrl(auth: User, input: FormUrlDto): Promise<FormUrlDto> {
    const response = await this.formUrlsApiWithAuth(
      auth,
    ).formUrlsControllerCreate({
      formUrlDto: input,
    } as FormUrlsControllerCreateRequest)

    return response as FormUrlDto
  }

  async deleteFormUrl(auth: User, input: FormUrlDto): Promise<void> {
    try {
      await this.formUrlsApiWithAuth(auth).formUrlsControllerDelete({
        formUrlDto: input,
      } as FormUrlsControllerDeleteRequest)
    } catch (error) {
      this.handleError(error, 'Error deleting form URL')
    }
  }
}
