import { Injectable } from '@nestjs/common'
import { MedmaeliBulkItemDTO } from '../../gen/fetch'
import {
  GetListInput,
  CreateListInput,
  BulkUploadInput,
  CanCreateInput,
} from './signature-collection.types'
import { Collection, CollectionStatus } from './types/collection.dto'
import { List, ListStatus, mapList, mapListBase } from './types/list.dto'
import { Signature, mapSignature } from './types/signature.dto'
import { CandidateLookup } from './types/user.dto'
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
import { SignatureCollectionSharedClientService } from './signature-collection-shared.service'

type Api =
  | AdminListApi
  | AdminCollectionApi
  | AdminSignatureApi
  | AdminCandidateApi

@Injectable()
export class SignatureCollectionAdminClientService {
  constructor(
    private listsApi: AdminListApi,
    private collectionsApi: AdminCollectionApi,
    private signatureApi: AdminSignatureApi,
    private sharedService: SignatureCollectionSharedClientService,
    private candidateApi: AdminCandidateApi,
  ) {}

  private getApiWithAuth<T extends Api>(api: T, auth: Auth) {
    return api.withMiddleware(new AuthMiddleware(auth)) as T
  }

  async currentCollection(): Promise<Collection> {
    return await this.sharedService.currentCollection(this.collectionsApi)
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

  async toggleListStatus(listId: string, auth: Auth): Promise<Success> {
    const listStatus = await this.listStatus(listId, auth)
    // Can only toggle list if it is in review or reviewed
    if (
      listStatus === ListStatus.InReview ||
      listStatus === ListStatus.Reviewed
    ) {
      const list = await this.getApiWithAuth(
        this.listsApi,
        auth,
      ).medmaelalistarIDToggleListPatch({ iD: parseInt(listId) })
      return { success: !!list }
    }
    return { success: false }
  }

  async processCollection(auth: Auth): Promise<Success> {
    const collectionStatus = await this.collectionStatus(auth)
    if (collectionStatus === CollectionStatus.Processing) {
      const collection = await this.getApiWithAuth(
        this.collectionsApi,
        auth,
      ).medmaelasofnunIDToggleSofnunPost({
        iD: parseInt((await this.currentCollection()).id),
      })
      return { success: !!collection }
    }
    return { success: false }
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

  async getAreas(collectionId?: string) {
    if (!collectionId) {
      const { id } = await this.currentCollection()
      collectionId = id
    }
    const areas = await this.collectionsApi.medmaelasofnunIDSvaediGet({
      iD: parseInt(collectionId),
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
    const { id } = await this.currentCollection()
    // check if collectionId is current collection and current collection is open
    if (collectionId !== id) {
      throw new Error('Collection id input wrong')
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
        sofnunID: parseInt(id),
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

  async canCreate({
    requirementsMet = false,
    canCreateInfo,
    isPresidential,
    ownedLists,
  }: CanCreateInput): Promise<Success> {
    // can create if requirements met and collection is active
    // if collection is presidential and user has no lists otherwise does not have lists for all areas of collection
    const alreadyOwnsAllLists = isPresidential
      ? ownedLists.length > 0
      : await this.getAreas().then(
          (areas) => areas.length === ownedLists.length,
        )

    const canCreate = requirementsMet && !alreadyOwnsAllLists
    const reasons =
      mapReasons({
        ...canCreateInfo,
        notOwner: !alreadyOwnsAllLists,
      }) ?? []
    return { success: canCreate, reasons }
  }

  async candidateLookup(
    nationalId: string,
    auth: Auth,
  ): Promise<CandidateLookup> {
    const collection = await this.currentCollection()
    const { id, isPresidential } = collection
    const user = await this.getApiWithAuth(
      this.collectionsApi,
      auth,
    ).medmaelasofnunIDEinsInfoAdminKennitalaGet({
      kennitala: nationalId,
      iD: parseInt(id),
    })
    const candidate = user.frambod ? mapCandidate(user.frambod) : undefined

    const ownedLists =
      user.medmaelalistar && candidate
        ? user.medmaelalistar?.map((list) => mapListBase(list))
        : []

    const { success: canCreate, reasons: canCreateInfo } = await this.canCreate(
      {
        requirementsMet: user.maFrambod,
        canCreateInfo: user.maFrambodInfo,
        ownedLists,
        isPresidential,
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
    return signaturesFound.map(mapSignature).filter((s) => s.valid)
  }

  async compareBulkSignaturesOnAllLists(
    nationalIds: string[],
    auth: Auth,
  ): Promise<Signature[]> {
    // Takes a list of nationalIds and returns signatures found on any list in current collection
    const { id } = await this.currentCollection()
    const signaturesFound = await this.getApiWithAuth(
      this.collectionsApi,
      auth,
    ).medmaelasofnunIDComparePost({
      iD: parseInt(id),
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
      .filter((s) => s.valid)
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
    const success = dagsetningLokar
      ? newEndDate.getTime() === dagsetningLokar.getTime()
      : false

    // const listStatus = await this.listStatus(listId, auth)
    // Can only toggle list if it is in review or reviewed
    if (success && list.lokadHandvirkt) {
      await this.getApiWithAuth(
        this.listsApi,
        auth,
      ).medmaelalistarIDToggleListPatch({ iD: parseInt(listId) })
    }
    return {
      success,
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
