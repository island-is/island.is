import { Injectable } from '@nestjs/common'
import { MedmaeliBulkItemDTO } from '../../gen/fetch'
import {
  GetListInput,
  CreateListInput,
  BulkUploadInput,
  ReasonKey,
} from './signature-collection.types'
import { Collection } from './types/collection.dto'
import { getSlug, List, ListStatus, mapListBase } from './types/list.dto'
import { Signature, mapSignature } from './types/signature.dto'
import { CandidateLookup } from './types/user.dto'
import {
  BulkUpload,
  getReasonKeyForPaperSignatureUpload,
  mapBulkResponse,
} from './types/bulkUpload.dto'
import { Success } from './types/success.dto'
import { mapCandidate } from './types/candidate.dto'
import { Slug } from './types/slug.dto'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  AdminCandidateApi,
  AdminCollectionApi,
  AdminListApi,
  AdminSignatureApi,
  AdminApi,
} from './apis'
import { SignatureCollectionSharedClientService } from './signature-collection-shared.service'
import {
  AreaSummaryReport,
  mapAreaSummaryReport,
} from './types/areaSummaryReport.dto'

type Api =
  | AdminListApi
  | AdminCollectionApi
  | AdminSignatureApi
  | AdminCandidateApi
  | AdminApi

@Injectable()
export class SignatureCollectionAdminClientService {
  constructor(
    private listsApi: AdminListApi,
    private collectionsApi: AdminCollectionApi,
    private sharedService: SignatureCollectionSharedClientService,
    private candidateApi: AdminCandidateApi,
    private adminApi: AdminApi,
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
        this.adminApi,
        auth,
      ).adminMedmaelalistiIDToggleListPatch({
        iD: parseInt(listId),
        shouldToggle: listStatus === ListStatus.InReview,
      })
      return { success: !!list }
    }
    return { success: false }
  }

  async processCollection(collectionId: string, auth: Auth): Promise<Success> {
    const collection = await this.getApiWithAuth(
      this.adminApi,
      auth,
    ).adminMedmaelasofnunIDToggleSofnunPatch({
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

    const candidates = await this.getApiWithAuth(
      this.candidateApi,
      auth,
    ).frambodGet({
      sofnunID: parseInt(collectionId),
    })

    const adminApi = this.getApiWithAuth(this.adminApi, auth)

    const filteredAreas = areas
      ? collectionAreas.filter((area) =>
          areas.flatMap((a) => a.areaId).includes(area.id),
        )
      : collectionAreas

    let candidacy = candidates.find((c) => c.kennitala === owner.nationalId)

    // If no candidacy exists, create one
    if (!candidacy) {
      candidacy = await adminApi.adminFrambodPost({
        frambodRequestDTO: {
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
    }
    // Candidacy exists, add area
    else {
      await adminApi.adminMedmaelalistiPost({
        medmaelalistarRequestDTO: {
          frambodID: candidacy.id,
          medmaelalistar: filteredAreas.map((area) => ({
            svaediID: parseInt(area.id),
            listiNafn: `${owner.name} - ${area.name}`,
          })),
        },
      })
    }

    const collectionsApi = this.getApiWithAuth(this.collectionsApi, auth)
    const votingType = await collectionsApi.medmaelasofnunIDGet({
      iD: candidacy.medmaelasofnunID ?? -1,
    })

    return {
      slug: getSlug(candidacy.id ?? '', votingType.kosningTegund),
    }
  }

  async unsignListAdmin(signatureId: string, auth: Auth): Promise<Success> {
    try {
      await this.getApiWithAuth(this.adminApi, auth).adminMedmaeliIDDelete({
        iD: parseInt(signatureId),
      })
      return { success: true }
    } catch (error) {
      return { success: false }
    }
  }

  async candidateLookup(
    nationalId: string,
    auth: Auth,
  ): Promise<CandidateLookup> {
    const collection = await this.currentCollection(auth)
    const { id, collectionType, areas } = collection
    const user = await this.getApiWithAuth(
      this.adminApi,
      auth,
    ).adminMedmaelasofnunIDEinsInfoKennitalaGet({
      kennitala: nationalId,
      iD: parseInt(id),
    })
    const candidate = user.frambod ? mapCandidate(user.frambod) : undefined

    const ownedLists =
      user.medmaelalistar && candidate
        ? user.medmaelalistar?.map((list) => mapListBase(list))
        : []

    const { success: canCreate, reasons: canCreateInfo } =
      this.sharedService.canCreate({
        requirementsMet: user.maFrambod,
        canCreateInfo: user.maFrambodInfo,
        ownedLists,
        collectionType,
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
      this.adminApi,
      auth,
    ).adminMedmaelalistiIDComparePost({
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
      this.adminApi,
      auth,
    ).adminMedmaelasofnunIDComparePost({
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
      this.adminApi,
      auth,
    ).adminMedmaelalistiIDExtendTimePatch({
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
        this.adminApi,
        auth,
      ).adminMedmaelalistiIDToggleListPatch({ iD: parseInt(listId) })
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
      this.adminApi,
      auth,
    ).adminMedmaelalistiIDMedmaeliBulkPost({
      iD: parseInt(listId),
      medmaeliBulkRequestDTO: { medmaeli },
    })

    return mapBulkResponse(signatures)
  }

  async removeCandidate(candidateId: string, auth: Auth): Promise<Success> {
    try {
      await this.getApiWithAuth(this.adminApi, auth).adminFrambodIDDelete({
        iD: parseInt(candidateId),
      })
      return { success: true }
    } catch (error) {
      return { success: false, reasons: [ReasonKey.DeniedByService] }
    }
  }

  async removeList(listId: string, auth: Auth): Promise<Success> {
    try {
      await this.getApiWithAuth(this.adminApi, auth).adminMedmaelalistiIDDelete(
        {
          iD: parseInt(listId),
        },
      )
      return { success: true }
    } catch (error) {
      return { success: false, reasons: [ReasonKey.DeniedByService] }
    }
  }

  async updateSignaturePageNumber(
    auth: Auth,
    signatureId: string,
    pageNumber: number,
  ): Promise<Success> {
    try {
      const res = await this.getApiWithAuth(
        this.adminApi,
        auth,
      ).adminMedmaeliIDUpdateBlsPatch({
        iD: parseInt(signatureId),
        blsNr: pageNumber,
      })
      return { success: res.bladsidaNr === pageNumber }
    } catch {
      return { success: false }
    }
  }

  async getAreaSummaryReport(
    auth: Auth,
    collectionId: string,
    areaId: string,
  ): Promise<AreaSummaryReport> {
    try {
      const res = await this.getApiWithAuth(
        this.adminApi,
        auth,
      ).adminMedmaelasofnunIDSvaediInfoSvaediIDGet({
        iD: parseInt(collectionId, 10),
        svaediID: parseInt(areaId, 10),
      })
      return mapAreaSummaryReport(res)
    } catch {
      return {} as AreaSummaryReport
    }
  }

  async signatureLookup(
    auth: Auth,
    collectionId: string,
    nationalId: string,
  ): Promise<Signature[]> {
    const lists = await this.getLists({ collectionId }, auth)
    try {
      const res = await this.getApiWithAuth(
        this.adminApi,
        auth,
      ).adminMedmaelasofnunIDComparePost({
        iD: parseInt(collectionId, 10),
        requestBody: [nationalId],
      })
      return res.map(mapSignature).map((s) => ({
        ...s,
        listTitle: lists.find((l) => l.id === s.listId)?.title,
      }))
    } catch {
      return []
    }
  }

  async lockList(auth: Auth, listId: string): Promise<Success> {
    try {
      const res = await this.getApiWithAuth(
        this.adminApi,
        auth,
      ).adminMedmaelalistiIDLockListPatch({
        iD: parseInt(listId, 10),
      })
      return { success: res.listaLokad ?? false }
    } catch {
      return { success: false }
    }
  }

  async uploadPaperSignature(
    auth: Auth,
    {
      listId,
      nationalId,
      pageNumber,
    }: { listId: string; nationalId: string; pageNumber: number },
  ): Promise<Success> {
    try {
      const signature = await this.getApiWithAuth(
        this.adminApi,
        auth,
      ).adminMedmaelalistiIDMedmaeliBulkPost({
        medmaeliBulkRequestDTO: {
          medmaeli: [
            {
              kennitala: nationalId,
              bladsida: pageNumber,
            },
          ],
        },
        iD: parseInt(listId),
      })

      const success = !!(
        signature.medmaeliKenn?.includes(nationalId) ||
        signature.medMedmaeliAnnarListi?.includes(nationalId)
      )

      return {
        success,
        reasons: success
          ? []
          : getReasonKeyForPaperSignatureUpload(signature, nationalId),
      }
    } catch {
      return {
        success: false,
        reasons: [ReasonKey.DeniedByService],
      }
    }
  }
}
