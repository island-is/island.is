import { Injectable } from '@nestjs/common'
import { SignatureCollection } from './models/collection.model'
import { SignatureCollectionList } from './models/signatureList.model'
import { SignatureCollectionSignature } from './models/signature.model'
import { SignatureCollectionManagerClientService } from '@island.is/clients/signature-collection'
import { User } from '@island.is/auth-nest-tools'
import {
  SignatureCollectionListStatus,
  SignatureCollectionStatus,
} from './models/status.model'

@Injectable()
export class SignatureCollectionManagerService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionManagerClientService,
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

  async collectionStatus(user: User): Promise<SignatureCollectionStatus> {
    const status = await this.signatureCollectionClientService.collectionStatus(
      user,
    )
    return { status }
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
