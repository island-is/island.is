import { Injectable } from '@nestjs/common'
import { SignatureCollectionSuccess } from './models/success.model'
import {
  SignatureCollection,
  SignatureCollectionInfo,
} from './models/collection.model'
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
import { Auth, User } from '@island.is/auth-nest-tools'
import { SignatureCollectionListBulkUploadInput } from './dto/bulkUpload.input'
import { SignatureCollectionSlug } from './models/slug.model'

@Injectable()
export class SignatureCollectionAdminService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionAdminClientService,
  ) {}

  async currentCollectionInfo(): Promise<SignatureCollectionInfo> {
    return await this.signatureCollectionClientService.currentCollectionInfo()
  }

  async current(collectionId: number): Promise<SignatureCollection> {
    return await this.signatureCollectionClientService.getCurrentCollection(
      collectionId,
    )
  }

  async allLists(
    collection: SignatureCollectionInfo,
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
    collectionId: number,
  ): Promise<SignatureCollectionSlug> {
    return await this.signatureCollectionClientService.createListsAdmin(
      { ...input, collectionId: collectionId.toString() },
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
}
