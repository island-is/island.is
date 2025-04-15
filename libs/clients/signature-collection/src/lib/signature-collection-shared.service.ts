import { Injectable, NotFoundException } from '@nestjs/common'
import {
  FrambodApi,
  MedmaelalistarApi,
  MedmaelasofnunApi,
} from '../../gen/fetch'
import { CanCreateInput, GetListInput } from './signature-collection.types'
import {
  Collection,
  CollectionStatus,
  CollectionType,
  mapCollection,
} from './types/collection.dto'
import { List, ListStatus, mapList } from './types/list.dto'
import { Signature, mapSignature } from './types/signature.dto'
import { AdminCandidateApi, AdminCollectionApi, AdminListApi } from './apis'
import { Success, mapReasons } from './types/success.dto'

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

    // Note: In the future, we may want to consider adding an optional parameter
    //       for filtering on CollectionType, as we may have multiple
    //       collections running at the same time. (not projected to happen currently)
    //       So keep CollectionType in mind if you're working on this
    //       for that reason, future programmer.
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
    try {
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
    } catch (error) {
      throw new NotFoundException('List not found')
    }
  }

  async getSignatures(api: ListApi, listId: string): Promise<Signature[]> {
    const signatures = await api.medmaelalistarIDMedmaeliGet({
      iD: parseInt(listId),
    })
    return signatures.map((signature) => mapSignature(signature))
  }

  canCreate({
    requirementsMet = false,
    canCreateInfo,
    collectionType,
    isActive = true,
    ownedLists,
    areas,
  }: CanCreateInput): Success {
    // can create if requirements met and collection is active
    // if collection is presidential and user has no lists otherwise does not have lists for all areas of collection
    const isPresidential = collectionType === CollectionType.Presidential
    const alreadyOwnsAllLists = isPresidential
      ? ownedLists.length > 0
      : areas.length === ownedLists.length

    const canCreate = requirementsMet && isActive && !alreadyOwnsAllLists
    const reasons =
      mapReasons({
        ...canCreateInfo,
        active: isActive,
        notOwner: !alreadyOwnsAllLists,
      }) ?? []
    return { success: canCreate, reasons }
  }

  getListStatus(list: List, collectionStatus: CollectionStatus): ListStatus {
    // Collection is open and list is active
    // List has been extended and is active
    if (list.active) {
      return ListStatus.Active
    }

    // Initial collection time has passed and list is not active and has not been manually reviewed
    // Extended list has expired in review
    if (!list.reviewed) {
      return ListStatus.InReview
    }

    if (!list.isExtended) {
      // Check if all lists have been reviewed and list is extendable
      // If collection is processed or if collection is active and not list
      if (
        collectionStatus === CollectionStatus.Processed ||
        collectionStatus === CollectionStatus.Active
      ) {
        return ListStatus.Extendable
      }
      if (list.reviewed && collectionStatus === CollectionStatus.InReview) {
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
