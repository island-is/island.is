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
import { SignatureCollectionAdminClientService } from '@island.is/clients/signature-collection'
import { SignatureCollectionExtendDeadlineInput } from './dto/extendDeadline.input'
import { User } from '@island.is/auth-nest-tools'
import { SignatureCollectionListBulkUploadInput } from './dto/bulkUpload.input'
import { SignatureCollectionSlug } from './models/slug.model'
import {
  SignatureCollectionListStatus,
} from './models/status.model'
import { SignatureCollectionIdInput } from './dto/collectionId.input'

@Injectable()
export class SignatureCollectionAdminService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionAdminClientService,
  ) {}

  async currentCollection(user: User): Promise<SignatureCollection> {
    return await this.signatureCollectionClientService.currentCollection(user)
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
    user: User,
  ): Promise<SignatureCollectionCandidateLookUp> {
    return await this.signatureCollectionClientService.candidateLookup(
      nationalId,
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
}
