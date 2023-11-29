import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Success } from './models/success.model'
import { Collection } from './models/collection.model'
import { CurrentCollection, Lists, Signatures, signee } from './mocks'
import { SignatureList } from './models/signatureList.model'
import { BypassAuth } from '@island.is/auth-nest-tools'
import { Signature } from './models/signature.model'
import { SignatureListNationalIdsInput } from './dto/signatureListNationalIds.input'
import { Bulk } from './models/bulk.model'
import { Signee } from './models/signee.model'
import { SignatureListInput } from './dto/singatureList.input'
import * as nationalId from 'kennitala'
import { FindSignatureInput } from './dto/findSignature.input'

@Injectable()
export class SignatureCollectionService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async test(): Promise<Success> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  //   CanCreate
  async canCreate(nationalId: string): Promise<Success> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: !!Lists.find((list) => list.owner.nationalId === nationalId),
        })
      }, 300)
    })
  }

  //   IsOwner
  async isOwner(nationalId: string): Promise<Success> {
    const hasList = !!Lists.find((list) => list.owner.nationalId === nationalId)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: hasList })
      }, 300)
    })
  }

  //   CanSign
  async canSign(nationalId: string): Promise<Success> {
    // TODO: return list person is signed on
    // TODO: take in list user is trying to sign
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  //   Current
  async current(): Promise<Collection> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CurrentCollection)
      }, 300)
    })
  }

  //   AllLists
  async allLists(): Promise<SignatureList[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Lists)
      }, 300)
    })
  }

  //   AllOpenLists
  @BypassAuth()
  async allOpenLists(): Promise<SignatureList[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Lists.filter((list) => list.active))
      }, 300)
    })
  }

  //   ListsByOwner
  async listsByOwner(nationalId: string): Promise<SignatureList[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Lists.filter((list) => list.owner.nationalId === nationalId))
      }, 300)
    })
  }

  //   ListsByArea
  async listsByArea(areaId: string): Promise<SignatureList[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Lists.filter((list) => list.area.id === areaId))
      }, 300)
    })
  }

  //   List
  async list(listId: string): Promise<SignatureList> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = Lists.find((list) => list.id === listId)
        list ? resolve(list) : reject(404)
      }, 300)
    })
  }

  //   SignedList
  async signedList(nationalId: string): Promise<SignatureList | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Lists[0])
      }, 300)
    })
  }

  //   Signatures
  async signatures(listId: string): Promise<Signature[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Signatures(listId).filter((sign) => sign.listId === listId))
      }, 300)
    })
  }

  //   FindSignature
  async findSignature({
    listId,
    query,
  }: FindSignatureInput): Promise<Signature | null> {
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

  //   CompareLists
  async compareLists({
    nationalIds,
    listId,
  }: SignatureListNationalIdsInput): Promise<Bulk> {
    const found: Signature[] = []

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

  //   Signee
  async signee(nationalId: string): Promise<Signee> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(signee(nationalId))
      }, 300)
    })
  }

  //   Create
  async create(input: SignatureListInput): Promise<Success> {
    console.log(input)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  //   Sign
  async sign(listId: string): Promise<Success> {
    console.log('sign ', listId)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  //   Unsign
  async unsign(listId: string): Promise<Success> {
    console.log('unsign ', listId)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  //   Cancel
  async cancel(nationalId: string): Promise<Success> {
    console.log('cancel ', nationalId)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  //   DelegateList
  async delegateList(input: SignatureListNationalIdsInput): Promise<Success> {
    console.log('delegateList ', input)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  //   UndelegateList
  async undelegateList(input: SignatureListNationalIdsInput): Promise<Success> {
    console.log('undelegateList ', input)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  //   ExtendDeadline
  async extendDeadline(): Promise<Success> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  //   BulkUploadSignatures
  async bulkUploadSignatures({
    nationalIds,
    listId,
  }: SignatureListNationalIdsInput): Promise<Bulk> {
    const notFound: Signature[] = []

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
