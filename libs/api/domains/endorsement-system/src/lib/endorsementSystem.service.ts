import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import {
  EndorsementApi,
  EndorsementListApi,
  EndorsementControllerCreateRequest,
  EndorsementControllerDeleteRequest,
  EndorsementListControllerCloseRequest,
  EndorsementListControllerCreateRequest,
  EndorsementListControllerFindListsRequest,
  EndorsementListControllerFindOneRequest,
  EndorsementControllerBulkCreateRequest,
  EndorsementControllerFindAllRequest,
  EndorsementControllerFindByUserRequest,
} from '../../gen/fetch'

const handleError = async (error: any) => {
  logger.error(JSON.stringify(error))

  if (error.json) {
    const json = await error.json()

    logger.error(json)

    throw new ApolloError(JSON.stringify(json), error.status)
  }

  throw new ApolloError('Failed to resolve request', error.status)
}

@Injectable()
export class EndorsementSystemService {
  constructor(
    private readonly endorsementApi: EndorsementApi,
    private readonly endorsementListApi: EndorsementListApi,
  ) {}

  // Endorsement endpoints
  async endorsementControllerFindAll(
    input: EndorsementControllerFindAllRequest,
  ) {
    return await this.endorsementApi
      .endorsementControllerFindAll(input)
      .catch(handleError)
  }

  async endorsementControllerFindByUser(
    input: EndorsementControllerFindByUserRequest,
  ) {
    return await this.endorsementApi
      .endorsementControllerFindByUser(input)
      .catch(handleError)
  }

  async endorsementControllerCreate(input: EndorsementControllerCreateRequest) {
    return await this.endorsementApi
      .endorsementControllerCreate(input)
      .catch(handleError)
  }

  async endorsementControllerBulkCreate(
    input: EndorsementControllerBulkCreateRequest,
  ) {
    return await this.endorsementApi
      .endorsementControllerBulkCreate(input)
      .catch(handleError)
  }

  async endorsementControllerDelete(input: EndorsementControllerDeleteRequest) {
    const result = await this.endorsementApi
      .endorsementControllerDelete(input)
      .catch(handleError)
    return Boolean(result)
  }

  // Endorsement list endpoints
  async endorsementListControllerFindLists(
    input: EndorsementListControllerFindListsRequest,
  ) {
    return await this.endorsementListApi
      .endorsementListControllerFindLists(input)
      .catch(handleError)
  }

  async endorsementListControllerFindEndorsements() {
    return await this.endorsementListApi
      .endorsementListControllerFindEndorsements()
      .catch(handleError)
  }

  async endorsementListControllerFindOne(
    input: EndorsementListControllerFindOneRequest,
  ) {
    return await this.endorsementListApi
      .endorsementListControllerFindOne(input)
      .catch(handleError)
  }

  async endorsementListControllerClose(
    input: EndorsementListControllerCloseRequest,
  ) {
    return await this.endorsementListApi
      .endorsementListControllerClose(input)
      .catch(handleError)
  }

  async endorsementListControllerCreate(
    endorsementList: EndorsementListControllerCreateRequest,
  ) {
    return await this.endorsementListApi
      .endorsementListControllerCreate(endorsementList)
      .catch(handleError)
  }
}
