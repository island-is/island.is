import { Injectable } from '@nestjs/common'
import { SignatureCollectionSuccess } from './models/success.model'
import { SignatureCollection } from './models/collection.model'
import {
  SignatureCollectionList,
  SignatureCollectionSignedList,
} from './models/signatureList.model'
import { SignatureCollectionSignature } from './models/signature.model'
import { SignatureCollectionSignee } from './models/signee.model'
import {
  ReasonKey,
  SignatureCollectionClientService,
} from '@island.is/clients/signature-collection'
import { User } from '@island.is/auth-nest-tools'
import { SignatureCollectionCancelListsInput } from './dto/cencelLists.input'
import { SignatureCollectionIdInput } from './dto/collectionId.input'

@Injectable()
export class SignatureCollectionService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionClientService,
  ) {}

  async currentCollection(): Promise<SignatureCollection> {
    return await this.signatureCollectionClientService.currentCollection()
  }

  async allOpenLists({
    collectionId,
  }: SignatureCollectionIdInput): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists({
      collectionId,
      onlyActive: true,
    })
  }

  async isCollector(candidateId: string, auth: User) {
    // Checks if actor is collector else adds actor as collector
    const res = await this.signatureCollectionClientService.isCollector(
      parseInt(candidateId),
      auth,
    )
    return res.success
  }

  async listsForUser(
    { collectionId }: SignatureCollectionIdInput,
    signee: SignatureCollectionSignee,
    user: User,
  ): Promise<SignatureCollectionList[]> {
    if (!signee.area || signee.canSignInfo?.includes(ReasonKey.UnderAge)) {
      return []
    }
    return await this.signatureCollectionClientService.getLists(
      {
        collectionId: collectionId,
        areaId: signee.area?.id,
        onlyActive: true,
      },
      user,
    )
  }

  async listsForOwner(
    { collectionId }: SignatureCollectionIdInput,
    signee: SignatureCollectionSignee,
    user: User,
  ): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists(
      {
        collectionId: collectionId,
        candidateId: signee.candidate?.id,
      },
      user,
    )
  }

  async list(listId: string, user: User): Promise<SignatureCollectionList> {
    return await this.signatureCollectionClientService.getList(listId, user)
  }

  async signedList(
    user: User,
  ): Promise<SignatureCollectionSignedList[] | null> {
    return await this.signatureCollectionClientService.getSignedList(user)
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

  async signee(
    user: User,
    nationalId?: string,
  ): Promise<SignatureCollectionSignee> {
    return await this.signatureCollectionClientService.getSignee(
      user,
      nationalId,
    )
  }

  async unsign(
    listId: string,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.unsignList(listId, user)
  }

  async cancel(
    input: SignatureCollectionCancelListsInput,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.removeLists(input, user)
  }
}
