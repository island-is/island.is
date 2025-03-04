import { Injectable, Inject } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApolloError } from '@apollo/client'
import { handle4xx } from '../../utils/errorHandler'
import {
  ListItemsControllerCreateRequest,
  ListItemsApi,
  ListItemsControllerDeleteRequest,
  ListItemsControllerUpdateRequest,
  ListItemsControllerUpdateDisplayOrderRequest,
} from '@island.is/clients/form-system'
import {
  CreateListItemInput,
  DeleteListItemInput,
  UpdateListItemDisplayOrderInput,
  UpdateListItemInput,
} from '../../dto/listItem.input'
import { ListItem } from '../../models/listItem.model'

@Injectable()
export class ListItemsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private listItemsApi: ListItemsApi,
  ) { }

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in list items service', err)

    throw new ApolloError(error.message)
  }

  private listItemsApiWithAuth(auth: User) {
    return this.listItemsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async createListItem(
    auth: User,
    input: CreateListItemInput,
  ): Promise<ListItem> {
    const response = await this.listItemsApiWithAuth(auth)
      .listItemsControllerCreate(input as ListItemsControllerCreateRequest)
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to create list item'),
      )

    if (!response || response instanceof ApolloError) {
      if (!(response instanceof ApolloError)) {
        throw new ApolloError({ errorMessage: JSON.stringify(response) })
      }
      throw response
    }

    return response
  }

  async deleteListItem(auth: User, input: DeleteListItemInput): Promise<void> {
    const response = await this.listItemsApiWithAuth(auth)
      .listItemsControllerDelete(input as ListItemsControllerDeleteRequest)
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to delete list item'),
      )

    if (!response || response instanceof ApolloError) {
      return
    }
    return response
  }

  async updateListItem(auth: User, input: UpdateListItemInput): Promise<void> {
    const response = await this.listItemsApiWithAuth(auth)
      .listItemsControllerUpdate(input as ListItemsControllerUpdateRequest)
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to update list item'),
      )

    if (!response || response instanceof ApolloError) {
      return
    }
    return response
  }

  async updateListItemsDisplayOrder(
    auth: User,
    input: UpdateListItemDisplayOrderInput,
  ): Promise<void> {
    const response = await this.listItemsApiWithAuth(auth)
      .listItemsControllerUpdateDisplayOrder(
        input as ListItemsControllerUpdateDisplayOrderRequest,
      )
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to update list item'),
      )

    if (!response || response instanceof ApolloError) {
      return
    }
    return response
  }
}
