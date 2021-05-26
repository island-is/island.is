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
  EndorsementListControllerFindOneRequest,
  EndorsementControllerBulkCreateRequest,
  EndorsementControllerFindAllRequest,
  EndorsementControllerFindByUserRequest,
  EndorsementListControllerFindByTagsRequest,
} from '../../gen/fetch'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

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
  constructor (
    private readonly _endorsementApi: EndorsementApi,
    private readonly _endorsementListApi: EndorsementListApi,
  ) {}

  endorsementApiWithAuth (auth: Auth) {
    return this._endorsementApi.withMiddleware(new AuthMiddleware(auth))
  }

  endorsementListApiWithAuth (auth: Auth) {
    return this._endorsementListApi.withMiddleware(new AuthMiddleware(auth))
  }

  // Endorsement endpoints
  async endorsementControllerFindAll (
    input: EndorsementControllerFindAllRequest,
    auth: Auth,
  ) {
    return await this.endorsementApiWithAuth(auth)
      .endorsementControllerFindAll(input)
      .catch(handleError)
  }

  async endorsementControllerFindByUser (
    input: EndorsementControllerFindByUserRequest,
    auth: Auth,
  ) {
    return await this.endorsementApiWithAuth(auth)
      .endorsementControllerFindByUser(input)
      .catch(handleError)
  }

  async endorsementControllerCreate (
    input: EndorsementControllerCreateRequest,
    auth: Auth,
  ) {
    return await this.endorsementApiWithAuth(auth)
      .endorsementControllerCreate(input)
      .catch(handleError)
  }

  async endorsementControllerBulkCreate (
    input: EndorsementControllerBulkCreateRequest,
    auth: Auth,
  ) {
    return await this.endorsementApiWithAuth(auth)
      .endorsementControllerBulkCreate(input)
      .catch(handleError)
  }

  async endorsementControllerDelete (
    input: EndorsementControllerDeleteRequest,
    auth: Auth,
  ) {
    const result = await this.endorsementApiWithAuth(auth)
      .endorsementControllerDelete(input)
      .catch(handleError)
    return Boolean(result)
  }

  // Endorsement list endpoints
  async endorsementListControllerFindLists (
    input: EndorsementListControllerFindByTagsRequest,
    auth: Auth,
  ) {
    return await this.endorsementListApiWithAuth(auth)
      .endorsementListControllerFindByTags(input)
      .catch(handleError)
  }

  async endorsementListControllerFindEndorsements (auth: Auth) {
    return await this.endorsementListApiWithAuth(auth)
      .endorsementListControllerFindEndorsements()
      .catch(handleError)
  }

  async endorsementListControllerFindOne (
    input: EndorsementListControllerFindOneRequest,
    auth: Auth,
  ) {
    return await this.endorsementListApiWithAuth(auth)
      .endorsementListControllerFindOne(input)
      .catch(handleError)
  }

  async endorsementListControllerClose (
    input: EndorsementListControllerCloseRequest,
    auth: Auth,
  ) {
    return await this.endorsementListApiWithAuth(auth)
      .endorsementListControllerClose(input)
      .catch(handleError)
  }

  async endorsementListControllerCreate (
    endorsementList: EndorsementListControllerCreateRequest,
    auth: Auth,
  ) {
    return await this.endorsementListApiWithAuth(auth)
      .endorsementListControllerCreate(endorsementList)
      .catch(handleError)
  }
}
