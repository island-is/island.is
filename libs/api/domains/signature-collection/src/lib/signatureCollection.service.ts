import { Injectable } from '@nestjs/common'
import { SignatureCollectionSuccess } from './models/success.model'
import { SignatureCollection } from './models/collection.model'
import { SignatureCollectionList } from './models/signatureList.model'
import { SignatureCollectionSignature } from './models/signature.model'
import { SignatureCollectionSignee } from './models/signee.model'
import { SignatureCollectionClientService } from '@island.is/clients/signature-collection'
import { User } from '@island.is/auth-nest-tools'
import { SignatureCollectionIdInput } from './dto/id.input'

@Injectable()
export class SignatureCollectionService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionClientService,
  ) {}

  async currentCollection(): Promise<SignatureCollection> {
    return await this.signatureCollectionClientService.currentCollection()
  }

  async allOpenLists({
    id: collectionId,
  }: SignatureCollection): Promise<SignatureCollectionList[]> {
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
    collection: SignatureCollection,
    signee: SignatureCollectionSignee,
    user: User,
  ): Promise<SignatureCollectionList[]> {
    const { id } = collection

    return await this.signatureCollectionClientService.getLists(
      {
        collectionId: id,
        areaId: signee.area?.id,
        onlyActive: true,
      },
      user,
    )
  }

  async listsForOwner(
    collection: SignatureCollection,
    signee: SignatureCollectionSignee,
    user: User,
  ): Promise<SignatureCollectionList[]> {
    const { id } = collection

    return await this.signatureCollectionClientService.getLists(
      {
        collectionId: id,
        candidateId: signee.candidate?.id,
      },
      user,
    )
  }

  async list(listId: string, user: User): Promise<SignatureCollectionList> {
    return await this.signatureCollectionClientService.getList(listId, user)
  }

  async signedList(user: User): Promise<SignatureCollectionList | null> {
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
    { id }: SignatureCollectionIdInput,
    user: User,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.removeLists(id, user)
  }
}
