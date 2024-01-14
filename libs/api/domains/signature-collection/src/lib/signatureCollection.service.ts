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
import { SignatureCollectionSignee } from './models/signee.model'
import { SignatureCollectionListInput } from './dto/singatureList.input'
import {
  GetListInput,
  SignatureCollectionClientService,
} from '@island.is/clients/signature-collection'
import { SignatureCollectionExtendDeadlineInput } from './dto/extendDeadlineInput'
import { User } from '@island.is/auth-nest-tools'
import { SignatureCollectionIdInput } from './dto/id.input'
import { SignatureCollectionListBulkUploadInput } from './dto/bulkUpload.input'
import { SignatureCollectionSlug } from './models/slug.model'
import { UserRole } from './utils/role.types'

@Injectable()
export class SignatureCollectionService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionClientService,
  ) {}

  async isOwner(
    signee: SignatureCollectionSignee,
  ): Promise<SignatureCollectionSuccess> {
    return { success: signee.isOwner }
  }

  async currentCollectionInfo(): Promise<SignatureCollectionInfo> {
    return await this.signatureCollectionClientService.currentCollectionInfo()
  }

  async current(collectionId: number): Promise<SignatureCollection> {
    return await this.signatureCollectionClientService.getCurrentCollection(
      collectionId,
    )
  }

  async allLists(): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists({})
  }

  async allOpenLists(): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists({})
  }

  async listsForUser(
    nationalId: string,
    collection: SignatureCollectionInfo,
    role: UserRole,
    signee: SignatureCollectionSignee,
  ): Promise<SignatureCollectionList[]> {
    // console.log('listsForUser', nationalId)
    // let params:GetListInput = {collectionId: collection.id,   areaId: undefined,
    //   nationalId,
    //   candidateId: undefined}
    // const {id} = collection
    // switch (role) {
    //   case UserRole.CANDIDATE_COLLECTOR:

    //     params = { ...params, candidateId: signee.candidate?.id, areaId: collection.isPresidential ?  }
    //   case UserRole.CANDIDATE_OWNER:
    //     return await this.signatureCollectionClientService.getLists({})
    //   case UserRole.USER:
    //     return await this.signatureCollectionClientService.getLists({})
    //   default:
    //     return []
    // }
    return await this.signatureCollectionClientService.getLists({ nationalId })
  }

  async list(listId: string): Promise<SignatureCollectionList> {
    return await this.signatureCollectionClientService.getList(listId)
  }

  async signedList(
    nationalId: string,
  ): Promise<SignatureCollectionList | null> {
    return await this.signatureCollectionClientService.getSignedList(nationalId)
  }

  async signatures(listId: string): Promise<SignatureCollectionSignature[]> {
    return await this.signatureCollectionClientService.getSignatures(listId)
  }

  async compareLists({
    nationalIds,
    listId,
  }: SignatureCollectionListNationalIdsInput): Promise<
    SignatureCollectionSignature[]
  > {
    return await this.signatureCollectionClientService.compareBulkSignaturesOnList(
      listId,
      nationalIds,
    )
  }

  async signee(nationalId: string): Promise<SignatureCollectionSignee> {
    return await this.signatureCollectionClientService.getSignee(nationalId)
  }

  async create(
    user: User,
    input: SignatureCollectionListInput,
  ): Promise<SignatureCollectionSlug> {
    return await this.signatureCollectionClientService.createLists(input)
  }

  async sign(
    listId: string,
    nationalId: string,
  ): Promise<SignatureCollectionSignature> {
    return await this.signatureCollectionClientService.signList(
      listId,
      nationalId,
    )
  }

  async unsign(
    listId: string,
    nationalId: string,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.unsignList(
      listId,
      nationalId,
    )
  }

  async unsignAdmin(signatureId: string): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.unsignListAdmin(
      signatureId,
    )
  }

  async cancel(
    nationalId: string,
    { id }: SignatureCollectionIdInput,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.removeLists(
      id,
      nationalId,
    )
  }

  async delegateList(
    input: SignatureCollectionListNationalIdsInput,
  ): Promise<SignatureCollectionSuccess> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  async undelegateList(
    input: SignatureCollectionListNationalIdsInput,
  ): Promise<SignatureCollectionSuccess> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  async extendDeadline({
    id,
    newEndDate,
  }: SignatureCollectionExtendDeadlineInput): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.extendDeadline(
      id,
      newEndDate,
    )
  }

  async bulkUploadSignatures(
    input: SignatureCollectionListBulkUploadInput,
  ): Promise<SignatureCollectionBulk> {
    return await this.signatureCollectionClientService.bulkUploadSignatures(
      input,
    )
  }

  async bulkCompareSignaturesAllLists({
    nationalIds,
  }: SignatureCollectionNationalIdsInput): Promise<
    SignatureCollectionSignature[]
  > {
    return await this.signatureCollectionClientService.compareBulkSignaturesOnAllLists(
      nationalIds,
    )
  }
}
