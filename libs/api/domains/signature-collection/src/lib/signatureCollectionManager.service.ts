import { Injectable } from '@nestjs/common'
import {
  SignatureCollection,
  SignatureCollectionInfo,
} from './models/collection.model'
import { SignatureCollectionList } from './models/signatureList.model'
import { SignatureCollectionSignature } from './models/signature.model'
import { SignatureCollectionManagerClientService } from '@island.is/clients/signature-collection'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class SignatureCollectionManagerService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionManagerClientService,
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
}
