import { Injectable } from '@nestjs/common'
import { SignatureCollection } from './models/collection.model'
import { SignatureCollectionList } from './models/signatureList.model'
import { SignatureCollectionSignature } from './models/signature.model'
import {
  CollectionType,
  SignatureCollectionManagerClientService,
} from '@island.is/clients/signature-collection'
import { User } from '@island.is/auth-nest-tools'
import { SignatureCollectionListStatus } from './models/status.model'
import { SignatureCollectionIdInput } from './dto/collectionId.input'

@Injectable()
export class SignatureCollectionManagerService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionManagerClientService,
  ) {}

  async currentCollection(user: User): Promise<SignatureCollection[]> {
    return await this.signatureCollectionClientService.currentCollection(user)
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

  async signatures(
    listId: string,
    user: User,
  ): Promise<SignatureCollectionSignature[]> {
    return await this.signatureCollectionClientService.getSignatures(
      listId,
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
}
