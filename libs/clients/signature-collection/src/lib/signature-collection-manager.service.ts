import { Injectable } from '@nestjs/common'
import { GetListInput } from './signature-collection.types'
import {
  Collection,
  mapCollectionInfo,
  CollectionInfo,
  mapCollection,
} from './types/collection.dto'
import { List, mapList } from './types/list.dto'
import { Signature, mapSignature } from './types/signature.dto'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { ManagerCollectionApi, ManagerListApi } from './apis'

type Api = ManagerListApi | ManagerCollectionApi

@Injectable()
export class SignatureCollectionManagerClientService {
  constructor(
    private listsApi: ManagerListApi,
    private collectionsApi: ManagerCollectionApi,
  ) {}

  private getApiWithAuth<T extends Api>(api: T, auth: Auth) {
    return api.withMiddleware(new AuthMiddleware(auth)) as T
  }

  async currentCollectionInfo(): Promise<CollectionInfo> {
    // includeInactive: false will return collections as active until electionday for collection has passed
    const res = await this.collectionsApi.medmaelasofnunGet({
      includeInactive: true,
    })
    const current = (
      res
        .map(mapCollectionInfo)
        .filter(
          (collection) => collection?.isSignatureCollection,
        ) as CollectionInfo[]
    ).sort((a, b) => (a.endTime < b.endTime ? 1 : -1))[0]

    if (!current) {
      throw new Error('No current collection')
    }
    return current
  }

  async getCurrentCollection(collectionId?: number): Promise<Collection> {
    if (!collectionId) {
      const { id } = await this.currentCollectionInfo()

      collectionId = id
    }

    const currentCollection = await this.collectionsApi.medmaelasofnunIDGet({
      iD: collectionId,
    })
    return mapCollection(currentCollection)
  }

  async getLists(
    { collectionId, areaId, candidateId, onlyActive }: GetListInput,
    auth: Auth,
  ): Promise<List[]> {
    const lists = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarGet({
      sofnunID: collectionId,
      svaediID: areaId ? parseInt(areaId) : undefined,
      frambodID: candidateId ? parseInt(candidateId) : undefined,
    })

    const listsMapped = lists.map((list) => mapList(list))
    return onlyActive ? listsMapped.filter((list) => list.active) : listsMapped
  }

  async getList(listId: string, auth: Auth): Promise<List> {
    const list = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarIDGet({
      iD: parseInt(listId),
    })
    return mapList(list)
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
      .filter((s) => s.active)
  }
}
