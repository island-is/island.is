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
    const { status } = await this.currentCollection(auth)
    return this.sharedService.getListStatus(list, status)
  }
}
