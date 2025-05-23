import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
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
  UpdateSectionInput,
  UpdateSectionsDisplayOrderInput,
} from '../../dto/section.input'
import { Section } from '../../models/section.model'

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

  async createSection(auth: User, input: CreateSectionInput): Promise<Section> {
    const response = await this.sectionsApiWithAuth(
      auth,
    ).sectionsControllerCreate(input as SectionsControllerCreateRequest)

    return response as Section
  }

  async deleteSection(auth: User, input: DeleteSectionInput): Promise<void> {
    await this.sectionsApiWithAuth(auth).sectionsControllerDelete(
      input as SectionsControllerDeleteRequest,
    )
  }

  async updateSection(auth: User, input: UpdateSectionInput): Promise<Section> {
    const response = await this.sectionsApiWithAuth(
      auth,
    ).sectionsControllerUpdate(input as SectionsControllerUpdateRequest)

    return response as unknown as Section
  }

  async updateSectionsDisplayOrder(
    auth: User,
    input: UpdateSectionsDisplayOrderInput,
  ): Promise<void> {
    await this.sectionsApiWithAuth(auth).sectionsControllerUpdateDisplayOrder(
      input as SectionsControllerUpdateDisplayOrderRequest,
    )
  }
}
