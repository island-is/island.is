import { Injectable, Inject } from '@nestjs/common'
import { MedmaeliBulkItemDTO } from '../../gen/fetch'
import {
  GetListInput,
  CreateListInput,
  BulkUploadInput,
  CanCreateInput,
  CanSignInput,
} from './signature-collection.types'
import {
  Collection,
  mapCollectionInfo,
  CollectionInfo,
  mapCollection,
} from './types/collection.dto'
import { List, mapList, mapListBase } from './types/list.dto'
import { Signature, mapSignature } from './types/signature.dto'
import { CandidateLookup, Signee } from './types/user.dto'
import { BulkUpload, mapBulkResponse } from './types/bulkUpload.dto'

import { Success, mapReasons } from './types/success.dto'
import { mapCandidate } from './types/candidate.dto'
import { Slug } from './types/slug.dto'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  AdminCandidateApi,
  AdminCollectionApi,
  AdminListApi,
  AdminSignatureApi,
} from './apis'

type Api =
  | AdminListApi
  | AdminCollectionApi
  | AdminSignatureApi
  | AdminCandidateApi

@Injectable()
export class SignatureCollectionAdmminClientService {
  constructor(
    private listsApi: AdminListApi,
    private collectionsApi: AdminCollectionApi,
    private signatureApi: AdminSignatureApi,
    private candidateApi: AdminCandidateApi,
  ) {}

  private getApiWithAuth<T extends Api>(api: T, auth: Auth) {
    return api.withMiddleware(new AuthMiddleware(auth)) as T
  }

  async test(auth: Auth): Promise<Success> {
    const res = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarTokenGet()
    console.log('TOKEN', res)
    return { success: true }
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

  async getAreas(collectionId?: number) {
    if (!collectionId) {
      const { id } = await this.currentCollectionInfo()
      collectionId = id
    }
    const areas = await this.collectionsApi.medmaelasofnunIDSvaediGet({
      iD: collectionId,
    })
    return areas.map((area) => ({
      id: area.id ?? 0,
      name: area.nafn ?? '',
    }))
  }

  async createListsAdmin(
    { collectionId, owner, areas }: CreateListInput,
    auth: Auth,
  ): Promise<Slug> {
    const { id, isActive } = await this.currentCollectionInfo()
    // check if collectionId is current collection and current collection is open
    if (collectionId !== id.toString() || !isActive) {
      throw new Error('Collection is not open')
    }

    const collectionAreas = await this.getAreas(id)
    const filteredAreas = areas
      ? collectionAreas.filter((area) =>
          areas.flatMap((a) => parseInt(a.areaId)).includes(area.id),
        )
      : collectionAreas

    const lists = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarAddListarAdminPost({
      medmaelalistiRequestDTO: {
        sofnunID: id,
        kennitala: owner.nationalId,
        simi: owner.phone,
        netfang: owner.email,
        medmaelalistar: filteredAreas.map((area) => ({
          svaediID: area.id,
          listiNafn: `${owner.name} - ${area.name}`,
        })),
      },
    })
    if (filteredAreas.length !== lists.length) {
      throw new Error('Not all lists created')
    }
    const { slug } = mapList(lists[0])
    return { slug }
  }

  async unsignListAdmin(signatureId: string, auth: Auth): Promise<Success> {
    const signature = await this.getApiWithAuth(
      this.signatureApi,
      auth,
    ).medmaeliIDRemoveMedmaeliAdminPost({
      iD: parseInt(signatureId),
    })
    return { success: !!signature }
  }

  async canSign({
    requirementsMet = false,
    canSignInfo,
    isActive,
    activeSignature,
  }: CanSignInput): Promise<Success> {
    const reasons = mapReasons({
      ...canSignInfo,
      active: isActive,
      notSigned: activeSignature === undefined,
    })
    return { success: requirementsMet && isActive && !activeSignature, reasons }
  }

  async canCreate({
    requirementsMet = false,
    canCreateInfo,
    isPresidential,
    isActive,
    ownedLists,
  }: CanCreateInput): Promise<Success> {
    // can create if requirements met and collection is active
    // if collection is presidential and user has no lists otherwise does not have lists for all areas of collection
    const alreadyOwnsAllLists = isPresidential
      ? ownedLists.length > 0
      : await this.getAreas().then(
          (areas) => areas.length === ownedLists.length,
        )

    const canCreate = requirementsMet && isActive && !alreadyOwnsAllLists
    const reasons =
      mapReasons({
        ...canCreateInfo,
        active: isActive,
        notOwner: !alreadyOwnsAllLists,
      }) ?? []
    return { success: canCreate, reasons }
  }

  async candidateLookup(
    nationalId: string,
    auth: Auth,
  ): Promise<CandidateLookup> {
    const collection = await this.currentCollectionInfo()
    const { id, isPresidential, isActive } = collection
    const user = await this.getApiWithAuth(
      this.collectionsApi,
      auth,
    ).medmaelasofnunIDEinsInfoKennitalaGet({
      kennitala: nationalId,
      iD: id,
    })
    const candidate = user.frambod ? mapCandidate(user.frambod) : undefined

    const ownedLists =
      user.medmaelalistar && candidate
        ? user.medmaelalistar?.map((list) =>
            mapListBase(list, candidate, collection),
          )
        : []

    const { success: canCreate, reasons: canCreateInfo } = await this.canCreate(
      {
        requirementsMet: user.maFrambod,
        canCreateInfo: user.maFrambodInfo,
        ownedLists,
        isPresidential,
        isActive,
      },
    )

    return {
      nationalId: user.kennitala ?? '',
      name: user.nafn ?? '',

      canCreate,
      canCreateInfo,
    }
  }

  async compareBulkSignaturesOnList(
    listId: string,
    nationalIds: string[],
    auth: Auth,
  ): Promise<Signature[]> {
    // Takes a list of nationalIds listId and returns signatures found on list
    const signaturesFound = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarIDComparePost({
      iD: parseInt(listId),
      requestBody: nationalIds,
    })
    return signaturesFound.map(mapSignature).filter((s) => s.active)
  }

  async compareBulkSignaturesOnAllLists(
    nationalIds: string[],
    auth: Auth,
  ): Promise<Signature[]> {
    // Takes a list of nationalIds and returns signatures found on any list in current collection
    const { id } = await this.currentCollectionInfo()
    const signaturesFound =
      await this.collectionsApi.medmaelasofnunIDComparePost({
        iD: id,
        requestBody: nationalIds,
      })
    // Get listTitle for signatures
    const allLists = await this.getLists({ collectionId: id }, auth)
    const listNameIndexer: Record<string, string> = allLists.reduce(
      (acc, list) => ({ ...acc, [list.id]: list.title }),
      {},
    )
    const signaturesMapped = signaturesFound
      .map(mapSignature)
      .filter((s) => s.active)
    signaturesMapped.forEach((signature) => {
      signature.listTitle = listNameIndexer[signature.listId]
    })
    return signaturesMapped
  }

  async extendDeadline(
    listId: string,
    newEndDate: Date,
    auth: Auth,
  ): Promise<Success> {
    const list = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarIDExtendTimePatch({
      iD: parseInt(listId),
      newEndDate: newEndDate,
    })
    const { dagsetningLokar } = list
    return {
      success: dagsetningLokar
        ? newEndDate.getTime() === dagsetningLokar.getTime()
        : false,
    }
  }

  async bulkUploadSignatures(
    { listId, upload }: BulkUploadInput,
    auth: Auth,
  ): Promise<BulkUpload> {
    const medmaeli: MedmaeliBulkItemDTO[] = upload.map((user) => ({
      kennitala: user.nationalId,
      bladsida: user.pageNumber,
    }))

    const signatures = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarIDAddMedmaeliBulkPost({
      iD: parseInt(listId),
      medmaeliBulkRequestDTO: { medmaeli },
    })

    return mapBulkResponse(signatures)
  }
}
