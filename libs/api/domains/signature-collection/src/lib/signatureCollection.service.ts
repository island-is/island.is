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
import { SignatureCollectionClientService } from '@island.is/clients/signature-collection'
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
  
  async test(user: User): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.test(user)
  }

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
  ): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists({
      collectionId: collection.id,
    })
  }

  async allOpenLists(
    collection: SignatureCollectionInfo,
  ): Promise<SignatureCollectionList[]> {
    return await this.signatureCollectionClientService.getLists({
      collectionId: collection.id,
      onlyActive: true,
    })
  }

  async listsForCollector(
    collection: SignatureCollectionInfo,
    role: UserRole,
    signee: SignatureCollectionSignee,
    user: User,
  ): Promise<SignatureCollectionList[]> {
    const { id, isPresidential } = collection
    const collectorNationalId = user.actor?.nationalId

    if (collectorNationalId) {
      const areaId = isPresidential
        ? undefined
        : await this.signee(collectorNationalId).then((data) => data.area?.id)
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
    role: UserRole,
    signee: SignatureCollectionSignee,
    user: User,
  ): Promise<SignatureCollectionList[]> {
    const { id } = collection
    if (role === UserRole.CANDIDATE_COLLECTOR) {
      return await this.listsForCollector(collection, role, signee, user)
    } else if (role === UserRole.CANDIDATE_OWNER) {
      return await this.signatureCollectionClientService.getLists({
        collectionId: id,
        candidateId: signee.candidate?.id,
      })
    } else if (role === UserRole.USER) {
      return await this.signatureCollectionClientService.getLists({
        collectionId: id,
        areaId: signee.area?.id,
        onlyActive: true,
      })
    } else {
      return []
    }
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
