import { Injectable } from '@nestjs/common'
import {
  FrambodApi,
  MedmaelalistarApi,
  MedmaelasofnunApi,
} from '../../gen/fetch'
import { GetListInput } from './signature-collection.types'
import { Collection, mapCollection } from './types/collection.dto'
import { List, mapList } from './types/list.dto'
import { Signature, mapSignature } from './types/signature.dto'
import { AdminCandidateApi, AdminCollectionApi, AdminListApi } from './apis'

type CollectionApi = MedmaelasofnunApi | AdminCollectionApi
type ListApi = MedmaelalistarApi | AdminListApi
type CandidateApi = FrambodApi | AdminCandidateApi

@Injectable()
export class SignatureCollectionSharedClientService {
  async currentCollection(api: CollectionApi): Promise<Collection> {
    // includeInactive: false will return collections as active until electionday for collection has passed
    const res = await api.medmaelasofnunGet({
      includeInactive: true,
    })

    const current = (
      res
        .map(mapCollection)
        .filter(
          (collection) =>
            collection?.isSignatureCollection &&
            collection.startTime < new Date(),
        ) as Collection[]
    ).sort((a, b) => (a.endTime < b.endTime ? 1 : -1))[0]

    if (!current) {
      throw new Error('No current collection')
    }
    return current
  }

  async getLists(
    { collectionId, areaId, candidateId, onlyActive }: GetListInput,
    api: ListApi,
  ): Promise<List[]> {
    const lists = await api.medmaelalistarGet({
      sofnunID: collectionId ? parseInt(collectionId) : undefined,
      svaediID: areaId ? parseInt(areaId) : undefined,
      frambodID: candidateId ? parseInt(candidateId) : undefined,
    })

    const listsMapped = lists.map((list) => mapList(list))
    return onlyActive ? listsMapped.filter((list) => list.active) : listsMapped
  }

  async getList(
    listId: string,
    listApi: ListApi,
    candidateApi: CandidateApi,
  ): Promise<List> {
    const list = await listApi.medmaelalistarIDGet({
      iD: parseInt(listId),
    })
    if (!list.frambod?.id) {
      throw new Error(
        'Fetch list failed. Received partial collection information from the national registry.',
      )
    }
    const { umbodList } = await candidateApi.frambodIDGet({
      iD: list.frambod?.id,
    })
    return mapList(list, umbodList)
  }

  async getSignatures(api: ListApi, listId: string): Promise<Signature[]> {
    const signatures = await api.medmaelalistarIDMedmaeliGet({
      iD: parseInt(listId),
    })
    return signatures
      .map((signature) => mapSignature(signature))
      .filter((s) => s.active)
  }
}
