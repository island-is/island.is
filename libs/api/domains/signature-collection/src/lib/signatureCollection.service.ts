import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SignatureCollectionSuccess } from './models/success.model'
import { SignatureCollection } from './models/collection.model'
import { CurrentCollection, Lists, Signatures, signee } from './mocks'
import { SignatureCollectionList } from './models/signatureList.model'
import { SignatureCollectionSignature } from './models/signature.model'
import { SignatureCollectionNationalIdsInput } from './dto/signatureListNationalIds.input'
import { SignatureCollectionBulk } from './models/bulk.model'
import { SignatureCollectionSignee } from './models/signee.model'
import { SignatureCollectionListInput } from './dto/singatureList.input'
import { SignatureCollectionFindSignatureInput } from './dto/findSignature.input'
import { SignatureCollectionClientService } from '@island.is/clients/signature-collection'
import { SignatureCollectionExtendDeadlineInput } from './dto/extendDeadlineInput'

@Injectable()
export class SignatureCollectionService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private signatureCollectionClientService: SignatureCollectionClientService,
  ) {}

  async canCreate(nationalId: string): Promise<SignatureCollectionSuccess> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: !!Lists.find((list) => list.owner.nationalId === nationalId),
        })
      }, 300)
    })
  }

  async isOwner(nationalId: string): Promise<SignatureCollectionSuccess> {
    const hasList = !!Lists.find((list) => list.owner.nationalId === nationalId)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: hasList })
      }, 300)
    })
  }

  async canSign(nationalId: string): Promise<SignatureCollectionSuccess> {
    // TODO: return list person is signed on
    // TODO: take in list user is trying to sign
    return this.signatureCollectionClientService.canSign(nationalId)
  }

  async current(): Promise<SignatureCollection> {
    return await this.signatureCollectionClientService.getCurrentCollection()
  }

  async allLists(): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists({})
  }

  async allOpenLists(): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists({})
  }

  async listsByOwner(nationalId: string): Promise<SignatureCollectionList[]> {
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

  async findSignature({
    listId,
    query,
  }: SignatureCollectionFindSignatureInput): Promise<SignatureCollectionSignature | null> {
    return new Promise((resolve) => {
      const singature =
        Signatures(listId).find(
          (sign) =>
            sign.signee.nationalId === query || sign.signee.name === query,
        ) ?? null
      setTimeout(() => {
        resolve(singature)
      }, 300)
    })
  }

  async compareLists({
    nationalIds,
    listId,
  }: SignatureCollectionNationalIdsInput): Promise<SignatureCollectionBulk> {
    const found: SignatureCollectionSignature[] = []

    Signatures(listId).map((signature) => {
      const nationalIdIndex = nationalIds.findIndex(
        (id) => signature.signee.nationalId === id,
      )
      if (nationalIdIndex > 0 && signature.listId === listId) {
        found.push(signature)
        nationalIds.splice(nationalIdIndex, 1)
      }
    })
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: found,
          failed: nationalIds.map((nationalId) => ({ nationalId })),
        })
      }, 300)
    })
  }

  async signee(nationalId: string): Promise<SignatureCollectionSignee> {
    return await this.signatureCollectionClientService.getSignee(nationalId)
  }

  async create(
    input: SignatureCollectionListInput,
  ): Promise<SignatureCollectionSuccess> {
    await this.signatureCollectionClientService.createLists(
      input.owner.nationalId,
    )
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
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

  async unsign(signatureId: string): Promise<SignatureCollectionSignature> {
    return await this.signatureCollectionClientService.unsignList(signatureId)
  }

  async cancel(nationalId: string): Promise<SignatureCollectionSuccess> {
    console.log('cancel ', nationalId)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  async delegateList(
    input: SignatureCollectionNationalIdsInput,
  ): Promise<SignatureCollectionSuccess> {
    console.log('delegateList ', input)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  async undelegateList(
    input: SignatureCollectionNationalIdsInput,
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

  async bulkUploadSignatures({
    nationalIds,
    listId,
  }: SignatureCollectionNationalIdsInput): Promise<SignatureCollectionBulk> {
    return await this.signatureCollectionClientService.bulkUploadSignatures(
      listId,
      nationalIds,
    )
  }
}
