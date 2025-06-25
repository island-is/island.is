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
  SignatureCollectionAdminClientService,
  SignatureCollectionClientService,
} from '@island.is/clients/signature-collection'
import { SignatureCollectionExtendDeadlineInput } from './dto/extendDeadline.input'
import { User } from '@island.is/auth-nest-tools'
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

@Injectable()
export class SignatureCollectionAdminService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionAdminClientService,
    private signatureCollectionBasicService: SignatureCollectionClientService,
  ) {}

  async currentCollection(
    user: User,
    collectionTypeFilter?: CollectionType,
  ): Promise<SignatureCollection[]> {
    return await this.signatureCollectionClientService.currentCollection(
      user,
      collectionTypeFilter,
    )
  }

  async getLatestCollectionForType(
    user: User,
    collectionType: CollectionType,
  ): Promise<SignatureCollection> {
    return await this.signatureCollectionClientService.getLatestCollectionForType(
      user,
      collectionType,
    )
  }

  async allLists(
    input: SignatureCollectionIdInput,
    user: User,
  ): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists(input, user)
  }

  async list(listId: string, user: User): Promise<SignatureCollectionList> {
    return await this.signatureCollectionClientService.getList(listId, user)
  }

  async getCanSignInfo(
    auth: User,
    nationalId: string,
    listId: string,
    collectionType: CollectionType,
  ): Promise<SignatureCollectionSuccess> {
    const signatureSignee =
      await this.signatureCollectionBasicService.getSignee(
        auth,
        collectionType,
        nationalId,
      )
    const list = await this.list(listId, auth)
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
    user: User,
  ): Promise<SignatureCollectionSignature[]> {
    return await this.signatureCollectionClientService.getSignatures(
      listId,
      user,
    )
  }

  async compareLists(
    { nationalIds, listId }: SignatureCollectionListNationalIdsInput,
    user: User,
  ): Promise<SignatureCollectionSignature[]> {
    return await this.signatureCollectionClientService.compareBulkSignaturesOnList(
      listId,
      nationalIds,
      user,
    )
  }

  async signee(
    nationalId: string,
    collectionType: CollectionType,
    user: User,
  ): Promise<SignatureCollectionCandidateLookUp> {
    return await this.signatureCollectionClientService.candidateLookup(
      nationalId,
      collectionType,
      user,
    )
  }

  async create(
    user: User,
    input: SignatureCollectionListInput,
  ): Promise<SignatureCollectionSlug> {
    return await this.signatureCollectionClientService.createListsAdmin(
      input,
      user,
    )
  }

  async unsignAdmin(
    signatureId: string,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.unsignListAdmin(
      signatureId,
      user,
    )
  }

  async extendDeadline(
    { listId, newEndDate }: SignatureCollectionExtendDeadlineInput,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.extendDeadline(
      listId,
      newEndDate,
      user,
    )
  }

  async bulkUploadSignatures(
    input: SignatureCollectionListBulkUploadInput,
    user: User,
  ): Promise<SignatureCollectionBulk> {
    return await this.signatureCollectionClientService.bulkUploadSignatures(
      input,
      user,
    )
  }

  async bulkCompareSignaturesAllLists(
    { nationalIds, collectionId }: SignatureCollectionNationalIdsInput,
    user: User,
  ): Promise<SignatureCollectionSignature[]> {
    return await this.signatureCollectionClientService.compareBulkSignaturesOnAllLists(
      nationalIds,
      collectionId,
      user,
    )
  }

  async processCollection(
    collectionId: string,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.processCollection(
      collectionId,
      user,
    )
  }

  async listStatus(
    listId: string,
    user: User,
  ): Promise<SignatureCollectionListStatus> {
    const status = await this.signatureCollectionClientService.listStatus(
      listId,
      user,
    )
    return { status }
  }

  async toggleListStatus(
    listId: string,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.toggleListStatus(
      listId,
      user,
    )
  }

  async removeCandidate(
    candidateId: string,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.removeCandidate(
      candidateId,
      user,
    )
  }

  async removeList(
    listId: string,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.removeList(listId, user)
  }

  async updateSignaturePageNumber(
    user: User,
    input: SignatureCollectionSignatureUpdateInput,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.updateSignaturePageNumber(
      user,
      input.signatureId,
      input.pageNumber,
    )
  }

  async signatureLookup(
    user: User,
    input: SignatureCollectionSignatureLookupInput,
  ): Promise<SignatureCollectionSignature[]> {
    return await this.signatureCollectionClientService.signatureLookup(
      user,
      input.collectionId,
      input.nationalId,
    )
  }

  async getAreaSummaryReport(
    input: SignatureCollectionAreaSummaryReportInput,
    user: User,
  ): Promise<SignatureCollectionAreaSummaryReport> {
    return await this.signatureCollectionClientService.getAreaSummaryReport(
      user,
      input.collectionId,
      input.areaId,
    )
  }

  async lockList(
    input: SignatureCollectionListIdInput,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.lockList(
      user,
      input.listId,
    )
  }

  async uploadPaperSignature(
    input: SignatureCollectionUploadPaperSignatureInput,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.uploadPaperSignature(
      user,
      input,
    )
  }
}
