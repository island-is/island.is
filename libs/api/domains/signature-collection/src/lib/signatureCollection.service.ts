import { Injectable } from '@nestjs/common'
import { SignatureCollectionSuccess } from './models/success.model'
import {
  SignatureCollection,
  SignatureCollectionInfo,
} from './models/collection.model'
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

  async currentCollectionInfo(): Promise<SignatureCollectionInfo> {
    return await this.signatureCollectionClientService.currentCollectionInfo()
  }

  async current(collectionId: number): Promise<SignatureCollection> {
    return await this.signatureCollectionClientService.getCurrentCollection(
      collectionId,
    )
  }

  async allOpenLists({
    id: collectionId,
  }: SignatureCollectionInfo): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists({
      collectionId,
      onlyActive: true,
    })
  }

  async listsForCollector(
    collection: SignatureCollectionInfo,
    signee: SignatureCollectionSignee,
    user: User,
  ): Promise<SignatureCollectionList[]> {
    const { id, isPresidential } = collection
    const collectorNationalId = user.actor?.nationalId

    if (collectorNationalId) {
      const areaId = isPresidential
        ? undefined
        : await this.signee(user, collectorNationalId).then(
            (data) => data.area?.id,
          )
      const lists = await this.signatureCollectionClientService.getLists({
        collectionId: id,
        candidateId: signee.candidate?.id,
        areaId,
      })
      if (isPresidential) {
        const isCollectorOnAllLists = lists.every((list) => {
          const collectors: string[] =
            list.collectors?.map((collector) => collector.nationalId) || []

          return collectors.includes(collectorNationalId)
        })

        if (isCollectorOnAllLists) {
          return lists
        } else {
          return await Promise.all(
            lists.map(
              async (list) =>
                await this.signatureCollectionClientService.delegateList(
                  parseInt(list.id),
                  collectorNationalId,
                ),
            ),
          )
        }
      } else if (areaId) {
        const areaList = lists.find((list) => list.area?.id === areaId)
        if (!areaList) {
          throw new Error('Area not found')
        }
        return [
          await this.signatureCollectionClientService.delegateList(
            parseInt(areaList.id),
            collectorNationalId,
          ),
        ]
      }
      return lists
    }
    return []
  }

  async listsForUser(
    collection: SignatureCollectionInfo,
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
    collection: SignatureCollectionInfo,
    signee: SignatureCollectionSignee,
    user: User,
  ): Promise<SignatureCollectionList[]> {
    const { id } = collection
    if (user.actor?.nationalId) {
      return await this.listsForCollector(collection, signee, user)
    } else {
      return await this.signatureCollectionClientService.getLists(
        {
          collectionId: id,
          candidateId: signee.candidate?.id,
        },
        user,
      )
    }
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
