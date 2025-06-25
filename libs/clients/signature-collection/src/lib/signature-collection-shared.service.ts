import { Injectable, NotFoundException } from '@nestjs/common'
import {
  FrambodApi,
  MedmaelalistarApi,
  KosningApi,
  MedmaelasofnunApi,
  MedmaelalistiDTO,
} from '../../gen/fetch'
import { CanCreateInput, GetListInput } from './signature-collection.types'
import {
  Collection,
  CollectionStatus,
  CollectionType,
  getCollectionTypeFromNumber,
  getNumberFromCollectionType,
  mapCollection,
} from './types/collection.dto'
import { List, ListStatus, mapList } from './types/list.dto'
import { Signature, mapSignature } from './types/signature.dto'
import { AdminCandidateApi, AdminListApi } from './apis'
import { Success, mapReasons } from './types/success.dto'
import { collapseGovernment } from './utils/mappers'

type ListApi = MedmaelalistarApi | AdminListApi
type CandidateApi = FrambodApi | AdminCandidateApi
type ElectionApi = KosningApi
type CollectionApi = MedmaelasofnunApi

@Injectable()
export class SignatureCollectionSharedClientService {
  async getLatestCollectionForType(
    api: ElectionApi,
    collectionType: CollectionType,
  ): Promise<Collection> {
    const baseRes = await api.kosningGet({
      hasSofnun: true,
      onlyActive: true,
    })

    let filteredBaseRes = baseRes.filter(
      (election) =>
        Boolean(election.id) &&
        election.kosningTegundNr ===
          getNumberFromCollectionType(collectionType),
    )

    if (
      collectionType === CollectionType.LocalGovernmental &&
      !filteredBaseRes.length
    ) {
      // No active local governmental elections, checking for "special" sveitó elections
      filteredBaseRes = baseRes.filter(
        (election) =>
          Boolean(election.id) &&
          election.kosningTegundNr ===
            getNumberFromCollectionType(
              CollectionType.SpecialLocalGovernmental,
            ),
      )
    }

    const elections = await Promise.all(
      filteredBaseRes.map(async ({ id }) => {
        const iD = id ?? 0 // Filter already applied but typing not catching up
        return await api.kosningIDSofnunListGet({ iD })
      }),
    )

    // The signature-collection system has operated on the assumption that
    // any Election type will have one and only one active collection.
    // However, this assumption was broken upon the introduction of
    // local governmental elections
    // Therefore we collapse the multitude of areas into one collection in that special case
    // to maintain generalization of the underlying systems in both the backend and frontend.
    if (
      collectionType === CollectionType.LocalGovernmental &&
      elections.length
    ) {
      const orderedCollapsedElections = elections
        .map((election) => collapseGovernment(election))
        .sort((a, b) => (a.endTime < b.endTime ? 1 : -1))

      if (!orderedCollapsedElections.length) {
        throw new Error('No current collection for selected type')
      }
      return orderedCollapsedElections[0]
    }

    const orderedCollections = (
      elections
        .flatMap((_) => _)
        .map(mapCollection)
        .filter(
          (collection) =>
            collection?.isSignatureCollection &&
            collection.startTime < new Date(),
        ) as Collection[]
    ).sort((a, b) => (a.endTime < b.endTime ? 1 : -1))

    if (!orderedCollections.length) {
      throw new Error('No current collection for selected type')
    }

    return orderedCollections[0]
  }

  async currentCollection(
    api: ElectionApi,
    collectionTypeFilter?: CollectionType,
  ): Promise<Collection[]> {
    // includeInactive: false will return collections as active until electionday for collection has passed
    const baseRes = await api.kosningGet({
      hasSofnun: true,
      onlyActive: true,
    })
    const collections = await Promise.all(
      baseRes
        .filter((election) => Boolean(election.id))
        .map(async ({ id }) => {
          const iD = id ?? 0 // Filter already applied but typing not catching up
          return await api.kosningIDSofnunListGet({ iD })
        }),
    )

    if (!collections.length) {
      throw new Error('No current collection')
    }
    let mappedCollections = collections.flatMap((_) => _).map(mapCollection)

    if (collectionTypeFilter) {
      if (collectionTypeFilter === CollectionType.LocalGovernmental) {
        // We can't use the earlier flatMap for LocalGovernmental elections because
        // the signature-collection system has operated on the assumption that
        // any Election type will have one and only one active collection.
        // However, this assumption was broken upon the introduction of
        // local governmental elections
        // Therefore we collapse the multitude of areas into one collection in that special case
        // to maintain generalization of the underlying systems in both the backend and frontend.

        mappedCollections = collections
          .filter(
            (collections) =>
              getCollectionTypeFromNumber(
                collections[0]?.kosning?.kosningTegundNr ?? 0,
              ) === CollectionType.LocalGovernmental,
          )
          .map(collapseGovernment)
      } else {
        mappedCollections = mappedCollections.filter(
          (collection) => collection.collectionType === collectionTypeFilter,
        )
      }
    }
    return mappedCollections
  }

  async getLists(
    {
      collectionId,
      areaId,
      candidateId,
      onlyActive,
      collectionType,
    }: GetListInput,
    listApi: ListApi,
    electionApi: ElectionApi,
  ): Promise<List[]> {
    let lists: Array<MedmaelalistiDTO>
    if (collectionType && collectionType === CollectionType.LocalGovernmental) {
      const electionIds = (
        await electionApi.kosningGet({
          onlyActive: true,
          hasSofnun: true,
        })
      )
        .filter(
          (election) =>
            getCollectionTypeFromNumber(election.kosningTegundNr) ===
            CollectionType.LocalGovernmental,
        )
        .map((election) => election.id)
      lists = []

      for (const electionId of electionIds) {
        const electionLists = await listApi.medmaelalistarGet({
          kosningID: electionId,
        })
        lists.push(...electionLists)
      }
    } else {
      lists = await listApi.medmaelalistarGet({
        sofnunID: collectionId ? parseInt(collectionId) : undefined,
        svaediID: areaId ? parseInt(areaId) : undefined,
        frambodID: candidateId ? parseInt(candidateId) : undefined,
      })
    }

    const listsMapped = lists.map((list) => mapList(list))
    return onlyActive ? listsMapped.filter((list) => list.active) : listsMapped
  }

  async getList(
    listId: string,
    listApi: ListApi,
    candidateApi: CandidateApi,
    collectionApi: CollectionApi,
  ): Promise<List> {
    try {
      const list = await listApi.medmaelalistarIDGet({
        iD: parseInt(listId),
      })

      const collection = await collectionApi.medmaelasofnunIDGet({
        iD: list.medmaelasofnunID ?? 0,
      })

      const collectionType = getCollectionTypeFromNumber(
        collection.kosning?.kosningTegundNr ?? 0,
      )

      if (!list.frambod?.id) {
        throw new Error(
          'Fetch list failed. Received partial collection information from the national registry.',
        )
      }
      const { umbodList } = await candidateApi.frambodIDGet({
        iD: list.frambod?.id,
      })
      return mapList(list, collectionType, umbodList)
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
