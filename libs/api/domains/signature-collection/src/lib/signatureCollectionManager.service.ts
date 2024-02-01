import { Injectable } from '@nestjs/common'
import { SignatureCollection } from './models/collection.model'
import { SignatureCollectionList } from './models/signatureList.model'
import { SignatureCollectionSignature } from './models/signature.model'
import { SignatureCollectionManagerClientService } from '@island.is/clients/signature-collection'
import { User } from '@island.is/auth-nest-tools'

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
}
