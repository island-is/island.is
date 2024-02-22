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
import { SignatureCollectionExtendDeadlineInput } from './dto/extendDeadlineInput'
import { User } from '@island.is/auth-nest-tools'
import { SignatureCollectionListBulkUploadInput } from './dto/bulkUpload.input'
import { SignatureCollectionSlug } from './models/slug.model'
import {
  SignatureCollectionListStatus,
  SignatureCollectionStatus,
} from './models/status.model'

@Injectable()
export class SignatureCollectionAdminService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionAdminClientService,
  ) {}

  async allLists(
    collection: SignatureCollection,
    user: User,
  ): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists(
      {
        collectionId: collection.id,
      },
      user,
    )
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
    collectionId: string,
  ): Promise<SignatureCollectionSlug> {
    return await this.signatureCollectionClientService.createListsAdmin(
      { ...input, collectionId: collectionId },
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
    { id, newEndDate }: SignatureCollectionExtendDeadlineInput,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.extendDeadline(
      id,
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
    { nationalIds }: SignatureCollectionNationalIdsInput,
    user: User,
  ): Promise<SignatureCollectionSignature[]> {
    return await this.signatureCollectionClientService.compareBulkSignaturesOnAllLists(
      nationalIds,
      user,
    )
  }

  async collectionStatus(user: User): Promise<SignatureCollectionStatus> {
    const status = await this.signatureCollectionClientService.collectionStatus(
      user,
    )
    return { status }
  }

  async processCollection(user: User): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.processCollection(user)
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
