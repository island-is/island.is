import { Injectable } from '@nestjs/common'
import { KosningApi, MedmaeliBulkItemDTO } from '../../gen/fetch'
import {
  GetListInput,
  CreateListInput,
  BulkUploadInput,
} from './signature-collection.types'
import { Collection, CollectionType } from './types/collection.dto'
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
  ManagerListApi,
  MunicipalityListApi,
  ManagerCollectionApi,
  ManagerCandidateApi,
  ManagerSignatureApi,
  MunicipalityCandidateApi,
  MunicipalityCollectionApi,
  MunicipalitySignatureApi,
  ManagerAdminApi,
} from './apis'
import { SignatureCollectionSharedClientService } from './signature-collection-shared.service'
import {
  AreaSummaryReport,
  mapAreaSummaryReport,
} from './types/areaSummaryReport.dto'
import { SignatureCollectionAdminClient } from './types/adminClient'

type Api =
  | AdminListApi
  | AdminCollectionApi
  | AdminSignatureApi
  | AdminCandidateApi
  | AdminApi
  | ManagerListApi
  | ManagerCollectionApi
  | ManagerSignatureApi
  | ManagerCandidateApi
  | ManagerAdminApi
  | MunicipalityListApi
  | MunicipalityCollectionApi
  | MunicipalitySignatureApi
  | MunicipalityCandidateApi
  | KosningApi

@Injectable()
export class SignatureCollectionAdminClientService
  implements SignatureCollectionAdminClient
{
  constructor(
    protected listsApi: AdminListApi,
    protected collectionsApi: AdminCollectionApi,
    protected electionsApi: KosningApi,
    protected sharedService: SignatureCollectionSharedClientService,
    protected candidateApi: AdminCandidateApi,
    protected adminApi: AdminApi,
  ) {}

  protected getApiWithAuth<T extends Api>(api: T, auth: Auth) {
    return api.withMiddleware(new AuthMiddleware(auth)) as T
  }

  async currentCollection(
    auth: Auth,
    collectionTypeFilter?: CollectionType,
  ): Promise<Collection[]> {
    return await this.sharedService.currentCollection(
      this.getApiWithAuth(this.electionsApi, auth),
      collectionTypeFilter,
    )
  }

  async getLatestCollectionForType(
    auth: Auth,
    collectionType: CollectionType,
  ): Promise<Collection> {
    return this.sharedService.getLatestCollectionForType(
      this.getApiWithAuth(this.electionsApi, auth),
      collectionType,
    )
  }

  async listStatus(listId: string, auth: Auth): Promise<ListStatus> {
    const list = await this.getList(listId, auth)
    const { status } = await this.getLatestCollectionForType(
      auth,
      list.collectionType,
    )
    return this.sharedService.getListStatus(list, status)
  }

  async toggleListStatus(listId: string, auth: Auth): Promise<Success> {
    const listStatus = await this.listStatus(listId, auth)
    // Can only toggle list if it is in review or reviewed

    try {
      const list = await this.getApiWithAuth(
        this.adminApi,
        auth,
      ).adminMedmaelalistiIDToggleListPatch({
        iD: parseInt(listId),
        shouldToggle: listStatus === ListStatus.InReview,
      })
      return { success: !!list }
    } catch (error) {
      if (error.status === 403) {
        error.body = 'Þú hefur ekki aðgang að þessari aðgerð.'
      }
      return {
        success: false,
        reasons: error.body ? [error.body] : [],
      }
    }
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
    if (
      input.collectionType &&
      input.collectionType === CollectionType.LocalGovernmental
    ) {
      input.areaId = await this.getMunicipalityAreaId(auth)
    }
    return await this.sharedService.getLists(
      input,
      this.getApiWithAuth(this.listsApi, auth),
      this.getApiWithAuth(this.electionsApi, auth),
    )
  }

  async getList(listId: string, auth: Auth): Promise<List> {
    return await this.sharedService.getList(
      listId,
      this.getApiWithAuth(this.listsApi, auth),
      this.getApiWithAuth(this.candidateApi, auth),
      this.getApiWithAuth(this.collectionsApi, auth),
      this.getApiWithAuth(this.electionsApi, auth),
    )
  }

  async getSignatures(listId: string, auth: Auth): Promise<Signature[]> {
    return await this.sharedService.getSignatures(
      this.getApiWithAuth(this.listsApi, auth),
      listId,
    )
  }

  async createListsAdmin(
    {
      collectionId,
      owner,
      areas,
      collectionType,
      collectionName,
    }: CreateListInput,
    auth: Auth,
  ): Promise<Slug & Success> {
    const collection = await this.getLatestCollectionForType(
      auth,
      collectionType,
    )
    const { areas: collectionAreas } = collection
    let id = collection.id
    // check if collectionId is current collection and current collection is open
    // In case of LocalGovernmental, collectionId is different from current collection id
    if (
      collectionType !== CollectionType.LocalGovernmental &&
      collectionId !== id
    ) {
      throw new Error('Collection id input wrong')
    } else {
      id = collectionId
    }

    try {
      const candidates = await this.getApiWithAuth(
        this.candidateApi,
        auth,
      ).frambodGet({
        sofnunID: parseInt(collectionId),
      })

      const adminApi = this.getApiWithAuth(this.adminApi, auth)

      const filteredAreas = areas?.length
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
            frambodNafn: collectionName,
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
        success: true,
      }
    } catch (error) {
      return {
        slug: '',
        success: false,
        reasons: error.body ? [error.body] : [],
      }
    }
  }

  async unsignListAdmin(signatureId: string, auth: Auth): Promise<Success> {
    try {
      await this.getApiWithAuth(this.adminApi, auth).adminMedmaeliIDDelete({
        iD: parseInt(signatureId),
      })
      return { success: true }
    } catch (error) {
      return { success: false, reasons: error.body ? [error.body] : [] }
    }
  }

  async candidateLookup(
    nationalId: string,
    collectionType: CollectionType,
    auth: Auth,
  ): Promise<CandidateLookup> {
    const collection = await this.getLatestCollectionForType(
      auth,
      collectionType,
    )
    const { id, areas } = collection
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
        ? user.medmaelalistar?.map((list) =>
            mapListBase(
              list,
              collection.areas.some(
                (area) => area.id === list.svaedi?.id?.toString(),
              ),
            ),
          )
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
    try {
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
    } catch (error) {
      return {
        success: false,
        reasons: error.body ? [error.body] : [],
      }
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
      return { success: false, reasons: error.body ? [error.body] : [] }
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
      return { success: false, reasons: error.body ? [error.body] : [] }
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
    } catch (error) {
      return { success: false, reasons: error.body ? [error.body] : [] }
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
    } catch (error) {
      return { success: false, reasons: error.body ? [error.body] : [] }
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
    } catch (error) {
      return {
        success: false,
        reasons: error.body ? [error.body] : [],
      }
    }
  }

  async startMunicipalityCollection(
    auth: Auth,
    areaId: string,
  ): Promise<Success> {
    const current = await this.getLatestCollectionForType(
      auth,
      CollectionType.LocalGovernmental,
    )
    try {
      const collection = await this.getApiWithAuth(
        this.adminApi,
        auth,
      ).adminKosningIDSveitSofnunPost({
        iD: parseInt(current.electionId ?? ''),
        sveitarfelagID: parseInt(areaId),
      })
      return { success: !!collection }
    } catch (error) {
      return { success: false, reasons: error.body ? [error.body] : [] }
    }
  }

  async getMunicipalityAreaId(auth: Auth): Promise<string> {
    const info = await this.getApiWithAuth(
      this.adminApi,
      auth,
    ).adminSveitarfelagInfoGet({
      kennitala: auth.nationalId,
    })
    return info?.[0]?.sveitarfelagID?.toString()
  }
}
