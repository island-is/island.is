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

  async currentCollection(): Promise<Collection> {
    return await this.sharedService.currentCollection(this.collectionsApi)
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
    const signatures = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarIDMedmaeliGet({
      iD: parseInt(listId),
    })
    return signatures
      .map((signature) => mapSignature(signature))
      .filter((s) => s.valid)
  }

  async collectionStatus(auth: Auth): Promise<CollectionStatus> {
    const collection = await this.currentCollection()
    // Collection in inital opening time
    if (collection.isActive) {
      return CollectionStatus.InitialActive
    }
    const allLists = await this.getLists({ collectionId: collection.id }, auth)
    let hasActive,
      hasExtended,
      hasInReview = false
    allLists.forEach((list) => {
      if (list.active) {
        hasActive = true
      }
      if (list.endTime > collection.endTime) {
        hasExtended = true
      }
      if (!list.reviewed) {
        hasInReview = true
      }
    })
    // Initial opening time passed not all lists reviewed
    if (!hasActive && !collection.processed && hasInReview) {
      return CollectionStatus.InInitialReview
    }
    // Initial opening time passed all lists reviewd
    if (!hasActive && !collection.processed && !hasInReview) {
      return CollectionStatus.Processing
    }
    // Initial opening time passed, collection has been manually processed
    if (!hasActive && collection.processed && !hasInReview) {
      return CollectionStatus.Processed
    }
    // Collection active if any lists have been extended
    if (hasActive && collection.processed && hasExtended) {
      return CollectionStatus.Active
    }
    // Collection had extended lists that have all expired
    if (!hasActive && collection.processed && hasExtended) {
      return CollectionStatus.InReview
    }
    return CollectionStatus.Inactive
  }

  async listStatus(listId: string, auth: Auth): Promise<ListStatus> {
    const collection = await this.currentCollection()

    const list = await this.getList(listId, auth)
    // Collection is open and list is active
    // List has been extended and is active
    if (list.endTime > new Date()) {
      return ListStatus.Active
    }
    const isExtended = list.endTime > collection.endTime

    // Initial collection time has passed and list is not active and has not been manually reviewed
    // Extended list has expired in review
    if (!list.reviewed) {
      return ListStatus.InReview
    }

    if (!isExtended) {
      // Check if all lists have been reviewed and list is extendable
      // If collection is processed or if collection is active and not list
      const collectionStatus = await this.collectionStatus(auth)
      if (
        collectionStatus === CollectionStatus.Processed ||
        collectionStatus === CollectionStatus.Active
      ) {
        return ListStatus.Extendable
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
