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
import { SignatureCollectionSignee } from './models/signee.model'
import { SignatureCollectionListInput } from './dto/singatureList.input'
import { SignatureCollectionClientService } from '@island.is/clients/signature-collection'
import { SignatureCollectionExtendDeadlineInput } from './dto/extendDeadlineInput'
import { User } from '@island.is/auth-nest-tools'
import { SignatureCollectionIdInput } from './dto/id.input'
import { SignatureCollectionListBulkUploadInput } from './dto/bulkUpload.input'

@Injectable()
export class SignatureCollectionService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionClientService,
  ) {}

  // async canCreate(nationalId: string): Promise<SignatureCollectionSuccess> {
  //   return await this.signatureCollectionClientService.canCreate(nationalId)
  // }

  async isOwner(nationalId: string): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.isOwner(nationalId)
  }

  // async canSign(nationalId: string): Promise<SignatureCollectionSuccess> {
  //   return this.signatureCollectionClientService.canSign(nationalId)
  // }

  async current(): Promise<SignatureCollection> {
    return await this.signatureCollectionClientService.getCurrentCollection()
  }

  async allLists(): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists({})
  }

  async allOpenLists(): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists({})
  }

  async listsForUser(nationalId: string): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists({ nationalId })
  }

  async listsByArea(areaId: string): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists({ areaId })
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
  ): Promise<SignatureCollectionList[]> {
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
    signatureId: string,
    nationalId: string,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.unsignList(
      signatureId,
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
    console.log('delegateList ', input)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  async undelegateList(
    input: SignatureCollectionListNationalIdsInput,
  ): Promise<SignatureCollectionSuccess> {
    console.log('undelegateList ', input)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  async extendDeadline({
    id,
    newEndDate,
  }: SignatureCollectionExtendDeadlineInput): Promise<SignatureCollectionList> {
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
