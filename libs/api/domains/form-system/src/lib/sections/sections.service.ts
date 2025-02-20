import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  SectionsApi,
  SectionsControllerCreateRequest,
  SectionsControllerDeleteRequest,
  SectionsControllerUpdateDisplayOrderRequest,
  SectionsControllerUpdateRequest,
} from '@island.is/clients/form-system'
import {
  CreateSectionInput,
  DeleteSectionInput,
  SectionDto,
  UpdateSectionInput,
  UpdateSectionsDisplayOrderInput,
} from '@island.is/form-system-dto'

@Injectable()
export class SectionsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private sectionsService: SectionsApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in sections service', err)

    throw new ApolloError(error.message)
  }

  private sectionsApiWithAuth(auth: User) {
    return this.sectionsService.withMiddleware(new AuthMiddleware(auth))
  }

  async createSection(
    auth: User,
    input: CreateSectionInput,
  ): Promise<SectionDto> {
    const response = await this.sectionsApiWithAuth(auth)
      .sectionsControllerCreate(input as SectionsControllerCreateRequest)
      .catch((e) => handle4xx(e, this.handleError, 'failed to create section'))

    if (!response || response instanceof ApolloError) {
      throw new Error('Failed to create section')
    }

    return response as SectionDto
  }

  async deleteSection(auth: User, input: DeleteSectionInput): Promise<void> {
    const response = await this.sectionsApiWithAuth(auth)
      .sectionsControllerDelete(input as SectionsControllerDeleteRequest)
      .catch((e) => handle4xx(e, this.handleError, 'failed to delete section'))

    if (!response || response instanceof ApolloError) {
      return
    }

    return
  }

  async updateSection(
    auth: User,
    input: UpdateSectionInput,
  ): Promise<SectionDto> {
    const response = await this.sectionsApiWithAuth(auth)
      .sectionsControllerUpdate(input as SectionsControllerUpdateRequest)
      .catch((e) => handle4xx(e, this.handleError, 'failed to update section'))

    if (!response || response instanceof ApolloError) {
      throw new Error('Failed to update section')
    }

    return response as SectionDto
  }

  async updateSectionsDisplayOrder(
    auth: User,
    input: UpdateSectionsDisplayOrderInput,
  ): Promise<void> {
    const response = await this.sectionsApiWithAuth(auth)
      .sectionsControllerUpdateDisplayOrder(
        input as SectionsControllerUpdateDisplayOrderRequest,
      )
      .catch((e) =>
        handle4xx(
          e,
          this.handleError,
          'failed to update section display order',
        ),
      )

    if (!response || response instanceof ApolloError) {
      return
    }

    return
  }
}
