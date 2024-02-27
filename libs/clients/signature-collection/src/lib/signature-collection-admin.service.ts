import { Injectable } from '@nestjs/common'
import { MedmaeliBulkItemDTO } from '../../gen/fetch'
import {
  GetListInput,
  CreateListInput,
  BulkUploadInput,
} from './signature-collection.types'
import { Collection } from './types/collection.dto'
import { List, ListStatus, mapList, mapListBase } from './types/list.dto'
import { Signature, mapSignature } from './types/signature.dto'
import { CandidateLookup } from './types/user.dto'
import { BulkUpload, mapBulkResponse } from './types/bulkUpload.dto'
import { Success } from './types/success.dto'
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

  async currentCollection(auth: Auth): Promise<Collection> {
    return await this.sharedService.currentCollection(
      this.getApiWithAuth(this.collectionsApi, auth),
    )
  }

  async listStatus(listId: string, auth: Auth): Promise<ListStatus> {
    const list = await this.getList(listId, auth)
    const { status } = await this.currentCollection(auth)
    return this.sharedService.getListStatus(list, status)
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

  async processCollection(collectionId: string, auth: Auth): Promise<Success> {
    const collection = await this.getApiWithAuth(
      this.collectionsApi,
      auth,
    ).medmaelasofnunIDToggleSofnunPost({
      iD: parseInt(collectionId),
    })
    return { success: !!collection }
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

  async createListsAdmin(
    { collectionId, owner, areas }: CreateListInput,
    auth: Auth,
  ): Promise<Slug> {
    const { id, areas: collectionAreas } = await this.currentCollection(auth)
    // check if collectionId is current collection and current collection is open
    if (collectionId !== id) {
      throw new Error('Collection id input wrong')
    }

    const filteredAreas = areas
      ? collectionAreas.filter((area) =>
          areas.flatMap((a) => a.areaId).includes(area.id),
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
          svaediID: parseInt(area.id),
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

  async candidateLookup(
    nationalId: string,
    auth: Auth,
  ): Promise<CandidateLookup> {
    const collection = await this.currentCollection(auth)
    const { id, isPresidential, areas } = collection
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

    const { success: canCreate, reasons: canCreateInfo } =
      await this.sharedService.canCreate({
        requirementsMet: user.maFrambod,
        canCreateInfo: user.maFrambodInfo,
        ownedLists,
        isPresidential,
        areas,
      })

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
    collectionId: string,
    auth: Auth,
  ): Promise<Signature[]> {
    // Takes a list of nationalIds and returns signatures found on any list in current collection
    const signaturesFound = await this.getApiWithAuth(
      this.collectionsApi,
      auth,
    ).medmaelasofnunIDComparePost({
      iD: parseInt(collectionId),
      requestBody: nationalIds,
    })

    // Get listTitle for signatures
    const allLists = await this.getLists({ collectionId }, auth)
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
