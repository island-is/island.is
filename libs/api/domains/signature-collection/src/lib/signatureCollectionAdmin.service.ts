import { Injectable } from '@nestjs/common'
import { SignatureCollectionSuccess } from './models/success.model'
import { SignatureCollection } from './models/collection.model'
import { SignatureCollectionList } from './models/signatureList.model'
import { SignatureCollectionSignature } from './models/signature.model'
import {
  SignatureCollectionListNationalIdsInput,
  SignatureCollectionNationalIdsInput,
} from './dto/signatureListNationalIds.input'
import { SignatureCollectionBulk } from './models/bulk.model'
import { SignatureCollectionCandidateLookUp } from './models/signee.model'
import { SignatureCollectionListInput } from './dto/singatureList.input'
import {
  CollectionType,
  ReasonKey,
  SignatureCollectionClientService,
  SignatureCollectionManagerClientService,
  SignatureCollectionMunicipalityClientService,
  SignatureCollectionAdminClientService,
} from '@island.is/clients/signature-collection'
import { SignatureCollectionExtendDeadlineInput } from './dto/extendDeadline.input'
import { SignatureCollectionListBulkUploadInput } from './dto/bulkUpload.input'
import { SignatureCollectionSlug } from './models/slug.model'
import { SignatureCollectionListStatus } from './models/status.model'
import { SignatureCollectionIdInput } from './dto/collectionId.input'
import { SignatureCollectionSignatureUpdateInput } from './dto/signatureUpdate.input'
import { SignatureCollectionSignatureLookupInput } from './dto/signatureLookup.input'
import { SignatureCollectionAreaSummaryReportInput } from './dto/areaSummaryReport.input'
import { SignatureCollectionAreaSummaryReport } from './models/areaSummaryReport.model'
import {
  SignatureCollectionListIdInput,
  SignatureCollectionUploadPaperSignatureInput,
} from './dto'
import { SignatureCollectionAdmin } from './models/admin.model'
import { AdminPortalScope } from '@island.is/auth/scopes'

@Injectable()
export class SignatureCollectionAdminService {
  constructor(
    private basicService: SignatureCollectionClientService,
    // admin = LKS
    private adminClientService: SignatureCollectionAdminClientService,
    // manager = Þjóðskrá
    private managerClientService: SignatureCollectionManagerClientService,
    // municipality = Sveitarfélög
    private municipalityService: SignatureCollectionMunicipalityClientService,
  ) {}

  private getService(scope: AdminPortalScope) {
    switch (scope) {
      case AdminPortalScope.signatureCollectionManage:
        return this.managerClientService
      case AdminPortalScope.signatureCollectionMunicipality:
        return this.municipalityService
      default:
        return this.adminClientService
    }
  }

  async getLatestCollectionForType(
    admin: SignatureCollectionAdmin,
    collectionType: CollectionType,
  ): Promise<SignatureCollection> {
    return this.getService(admin.adminScope).getLatestCollectionForType(
      admin,
      collectionType,
    )
  }

  async allLists(
    input: SignatureCollectionIdInput,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionList[]> {
    return this.getService(admin.adminScope).getLists(input, admin)
  }

  async list(
    listId: string,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionList> {
    return this.getService(admin.adminScope).getList(listId, admin)
  }

  async getCanSignInfo(
    admin: SignatureCollectionAdmin,
    nationalId: string,
    listId: string,
    collectionType: CollectionType,
  ): Promise<SignatureCollectionSuccess> {
    const signatureSignee = await this.basicService.getSignee(
      admin,
      collectionType,
      nationalId,
    )
    const list = await this.list(listId, admin)
    // Current signatures should not prevent paper signatures
    const canSign =
      signatureSignee.canSign ||
      (signatureSignee.canSignInfo?.length === 1 &&
        (signatureSignee.canSignInfo[0] === ReasonKey.AlreadySigned ||
          signatureSignee.canSignInfo[0] === ReasonKey.noInvalidSignature))

    const inArea = list.area.id === signatureSignee.area?.id
    return {
      success: canSign && inArea,
      reasons: canSign
        ? inArea
          ? []
          : [ReasonKey.NotInArea]
        : signatureSignee.canSignInfo,
    }
  }

  async signatures(
    listId: string,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionSignature[]> {
    return this.getService(admin.adminScope).getSignatures(listId, admin)
  }

  async compareLists(
    { nationalIds, listId }: SignatureCollectionListNationalIdsInput,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionSignature[]> {
    return this.getService(admin.adminScope).compareBulkSignaturesOnList(
      listId,
      nationalIds,
      admin,
    )
  }

  async signee(
    nationalId: string,
    collectionType: CollectionType,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionCandidateLookUp> {
    return await this.getService(admin.adminScope).candidateLookup(
      nationalId,
      collectionType,
      admin,
    )
  }

  async create(
    admin: SignatureCollectionAdmin,
    input: SignatureCollectionListInput,
  ): Promise<SignatureCollectionSlug> {
    return this.getService(admin.adminScope).createListsAdmin(input, admin)
  }

  async unsignAdmin(
    signatureId: string,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionSuccess> {
    return this.getService(admin.adminScope).unsignListAdmin(signatureId, admin)
  }

  async extendDeadline(
    { listId, newEndDate }: SignatureCollectionExtendDeadlineInput,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionSuccess> {
    return await this.getService(admin.adminScope).extendDeadline(
      listId,
      newEndDate,
      admin,
    )
  }

  async bulkUploadSignatures(
    input: SignatureCollectionListBulkUploadInput,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionBulk> {
    return await this.getService(admin.adminScope).bulkUploadSignatures(
      input,
      admin,
    )
  }

  async bulkCompareSignaturesAllLists(
    { nationalIds, collectionId }: SignatureCollectionNationalIdsInput,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionSignature[]> {
    return await this.getService(
      admin.adminScope,
    ).compareBulkSignaturesOnAllLists(nationalIds, collectionId, admin)
  }

  async processCollection(
    collectionId: string,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionSuccess> {
    return await this.getService(admin.adminScope).processCollection(
      collectionId,
      admin,
    )
  }

  async listStatus(
    listId: string,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionListStatus> {
    const status = await this.getService(admin.adminScope).listStatus(
      listId,
      admin,
    )
    return { status }
  }

  async toggleListStatus(
    listId: string,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionSuccess> {
    return await this.getService(admin.adminScope).toggleListStatus(
      listId,
      admin,
    )
  }

  async removeCandidate(
    candidateId: string,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionSuccess> {
    return await this.getService(admin.adminScope).removeCandidate(
      candidateId,
      admin,
    )
  }

  async removeList(
    listId: string,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionSuccess> {
    return await this.getService(admin.adminScope).removeList(listId, admin)
  }

  async updateSignaturePageNumber(
    admin: SignatureCollectionAdmin,
    input: SignatureCollectionSignatureUpdateInput,
  ): Promise<SignatureCollectionSuccess> {
    return await this.getService(admin.adminScope).updateSignaturePageNumber(
      admin,
      input.signatureId,
      input.pageNumber,
    )
  }

  async signatureLookup(
    admin: SignatureCollectionAdmin,
    input: SignatureCollectionSignatureLookupInput,
  ): Promise<SignatureCollectionSignature[]> {
    return await this.getService(admin.adminScope).signatureLookup(
      admin,
      input.collectionId,
      input.nationalId,
    )
  }

  async getAreaSummaryReport(
    input: SignatureCollectionAreaSummaryReportInput,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionAreaSummaryReport> {
    return await this.getService(admin.adminScope).getAreaSummaryReport(
      admin,
      input.collectionId,
      input.areaId,
    )
  }

  async lockList(
    input: SignatureCollectionListIdInput,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionSuccess> {
    return await this.getService(admin.adminScope).lockList(admin, input.listId)
  }

  async uploadPaperSignature(
    input: SignatureCollectionUploadPaperSignatureInput,
    admin: SignatureCollectionAdmin,
  ): Promise<SignatureCollectionSuccess> {
    return await this.getService(admin.adminScope).uploadPaperSignature(
      admin,
      input,
    )
  }

  async startMunicipalityCollection(
    admin: SignatureCollectionAdmin,
    areaId: string,
  ): Promise<SignatureCollectionSuccess> {
    return await this.getService(admin.adminScope).startMunicipalityCollection(
      admin,
      areaId,
    )
  }
}
