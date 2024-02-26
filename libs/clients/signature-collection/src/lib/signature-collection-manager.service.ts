import { Injectable } from '@nestjs/common'
import { GetListInput } from './signature-collection.types'
import { Collection, CollectionStatus } from './types/collection.dto'
import { List, ListStatus } from './types/list.dto'
import { Signature, mapSignature } from './types/signature.dto'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  ManagerCandidateApi,
  ManagerCollectionApi,
  ManagerListApi,
} from './apis'
import { SignatureCollectionSharedClientService } from './signature-collection-shared.service'

type Api = ManagerListApi | ManagerCollectionApi | ManagerCandidateApi

@Injectable()
export class SignatureCollectionManagerClientService {
  constructor(
    private listsApi: ManagerListApi,
    private collectionsApi: ManagerCollectionApi,
    private sharedService: SignatureCollectionSharedClientService,
    private candidateApi: ManagerCandidateApi,
  ) {}

  private getApiWithAuth<T extends Api>(api: T, auth: Auth) {
    return api.withMiddleware(new AuthMiddleware(auth)) as T
  }

  async currentCollection(auth: Auth): Promise<Collection> {
    return await this.sharedService.currentCollection(
      this.getApiWithAuth(this.collectionsApi, auth),
    )
  }

  async getLists(input: GetListInput, auth: Auth): Promise<List[]> {
    return await this.sharedService.getLists(
      input,
      this.getApiWithAuth(this.listsApi, auth),
    )
  }

  async getList(listId: string, auth: Auth): Promise<List> {
    return await this.sharedService.getList(
      listId,
      this.getApiWithAuth(this.listsApi, auth),
      this.getApiWithAuth(this.candidateApi, auth),
    )
  }

  async getSignatures(listId: string, auth: Auth): Promise<Signature[]> {
    return await this.sharedService.getSignatures(
      this.getApiWithAuth(this.listsApi, auth),
      listId,
    )
  }
  async listStatus(listId: string, auth: Auth): Promise<ListStatus> {
    const list = await this.getList(listId, auth)
    // Collection is open and list is active
    // List has been extended and is active
    if (list.endTime > new Date()) {
      return ListStatus.Active
    }
    const { status } = await this.currentCollection(auth)

    // Initial collection time has passed and list is not active and has not been manually reviewed
    // Extended list has expired in review
    if (!list.reviewed) {
      return ListStatus.InReview
    }

    if (!list.isExtended) {
      // Check if all lists have been reviewed and list is extendable
      // If collection is processed or if collection is active and not list
      if (
        status === CollectionStatus.Processed ||
        status === CollectionStatus.Active
      ) {
        return ListStatus.Extendable
      }
      if (list.reviewed && status === CollectionStatus.InReview) {
        return ListStatus.Inactive
      }
    }

    // Initial collection time has passed and list is not active and has been manually reviewed
    // Extended list has expired and has been manually reviewed
    if (list.reviewed) {
      return ListStatus.Reviewed
    }
    return ListStatus.Inactive
  }
}
