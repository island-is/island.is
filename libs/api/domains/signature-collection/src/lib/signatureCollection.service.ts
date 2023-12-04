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

@Injectable()
export class SignatureCollectionService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async test(): Promise<SignatureCollectionSuccess> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  async current(): Promise<SignatureCollection> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CurrentCollection)
      }, 300)
    })
  }

  async allLists(): Promise<SignatureCollectionList[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Lists)
      }, 300)
    })
  }

  async allOpenLists(): Promise<SignatureCollectionList[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Lists.filter((list) => list.active))
      }, 300)
    })
  }

  async listsByOwner(nationalId: string): Promise<SignatureCollectionList[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Lists.filter((list) => list.owner.nationalId === nationalId))
      }, 300)
    })
  }

  async listsByArea(areaId: string): Promise<SignatureCollectionList[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Lists.filter((list) => list.area.id === areaId))
      }, 300)
    })
  }

  async list(listId: string): Promise<SignatureCollectionList> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = Lists.find((list) => list.id === listId)
        list ? resolve(list) : reject(404)
      }, 300)
    })
  }

  async signedList(
    nationalId: string,
  ): Promise<SignatureCollectionList | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Lists[0])
      }, 300)
    })
  }

  async signatures(listId: string): Promise<SignatureCollectionSignature[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Signatures(listId).filter((sign) => sign.listId === listId))
      }, 300)
    })
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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(signee(nationalId))
      }, 300)
    })
  }

  async create(
    input: SignatureCollectionListInput,
  ): Promise<SignatureCollectionSuccess> {
    console.log(input)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  async sign(listId: string): Promise<SignatureCollectionSuccess> {
    console.log('sign ', listId)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  async unsign(listId: string): Promise<SignatureCollectionSuccess> {
    console.log('unsign ', listId)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
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

  async extendDeadline(): Promise<SignatureCollectionSuccess> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  async bulkUploadSignatures({
    nationalIds,
    listId,
  }: SignatureCollectionNationalIdsInput): Promise<SignatureCollectionBulk> {
    const notFound: SignatureCollectionSignature[] = []

    Signatures(listId).map((signature) => {
      const nationalIdIndex = nationalIds.findIndex(
        (id) => signature.signee.nationalId === id,
      )
      if (nationalIdIndex > 0 && signature.listId === listId) {
        notFound.push(signature)
        nationalIds.splice(nationalIdIndex, 1)
      }
    })
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: notFound,
          failed: nationalIds.map((nationalId) => ({ nationalId })),
        })
      }, 300)
    })
  }
}
