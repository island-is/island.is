import { Injectable, Inject } from "@nestjs/common";
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from "@apollo/client";
import { ApplicationsApi } from '@island.is/clients/form-system'
import { CreateApplicationInput } from "../../dto/application.input";

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private applicationsApi: ApplicationsApi
  ) { }

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in forms service', err)

    throw new ApolloError(error.message)
  }

  private applicationsApiWithAuth(auth: User) {
    return this.applicationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createApplication(auth: User, input: CreateApplicationInput)
}
