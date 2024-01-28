import { Injectable } from '@nestjs/common'
import {
  FrambodApi,
  MedmaelalistarApi,
  MedmaelasofnunApi,
  MedmaeliApi,
} from '../../gen/fetch'
import {
  GetListInput,
  CreateListInput,
  ReasonKey,
  CanCreateInput,
  CanSignInput,
} from './signature-collection.types'
import {
  Collection,
  mapCollectionInfo,
  CollectionInfo,
  mapCollection,
} from './types/collection.dto'
import { List, mapList, mapListBase } from './types/list.dto'
import { Signature, mapSignature } from './types/signature.dto'
import { Signee } from './types/user.dto'
import { Success, mapReasons } from './types/success.dto'
import { mapCandidate } from './types/candidate.dto'
import { Slug } from './types/slug.dto'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
type Api = MedmaelalistarApi | MedmaelasofnunApi | MedmaeliApi | FrambodApi

@Injectable()
export class SignatureCollectionClientService {
  constructor(
    private listsApi: MedmaelalistarApi,
    private collectionsApi: MedmaelasofnunApi,
    private signatureApi: MedmaeliApi,
    private candidateApi: FrambodApi,
  ) {}

  private getApiWithAuth<T extends Api>(api: T, auth: Auth) {
    return api.withMiddleware(new AuthMiddleware(auth)) as T
  }

  async test(auth: Auth): Promise<Success> {
    const res = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarTokenGet()
    console.log('TOKEN', res)
    return { success: true }
  }

  async currentCollectionInfo(): Promise<CollectionInfo> {
    // includeInactive: false will return collections as active until electionday for collection has passed
    const res = await this.collectionsApi.medmaelasofnunGet({
      includeInactive: true,
    })
    const current = (
      res
        .map(mapCollectionInfo)
        .filter(
          (collection) => collection?.isSignatureCollection,
        ) as CollectionInfo[]
    ).sort((a, b) => (a.endTime < b.endTime ? 1 : -1))[0]

    if (!current) {
      throw new Error('No current collection')
    }
    return current
  }

  async getCurrentCollection(collectionId?: number): Promise<Collection> {
    if (!collectionId) {
      const { id } = await this.currentCollectionInfo()

      collectionId = id
    }

    const currentCollection = await this.collectionsApi.medmaelasofnunIDGet({
      iD: collectionId,
    })
    return mapCollection(currentCollection)
  }

  async getLists(
    { collectionId, areaId, candidateId, onlyActive }: GetListInput,
    auth?: Auth,
  ): Promise<List[]> {
    const api = auth ? this.getApiWithAuth(this.listsApi, auth) : this.listsApi
    const lists = await api.medmaelalistarGet({
      sofnunID: collectionId,
      svaediID: areaId ? parseInt(areaId) : undefined,
      frambodID: candidateId ? parseInt(candidateId) : undefined,
    })

    const listsMapped = lists.map((list) => mapList(list))
    return onlyActive ? listsMapped.filter((list) => list.active) : listsMapped
  }

  async getList(listId: string, auth: Auth): Promise<List> {
    const list = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarIDGet({
      iD: parseInt(listId),
    })
    return mapList(list)
  }

  async getSignatures(listId: string, auth: Auth): Promise<Signature[]> {
    const signatures = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarIDMedmaeliGet({
      iD: parseInt(listId),
    })
    return signatures
      .map((signature) => mapSignature(signature))
      .filter((s) => s.active)
  }

  async getAreas(collectionId?: number) {
    if (!collectionId) {
      const { id } = await this.currentCollectionInfo()
      collectionId = id
    }
    const areas = await this.collectionsApi.medmaelasofnunIDSvaediGet({
      iD: collectionId,
    })
    return areas.map((area) => ({
      id: area.id ?? 0,
      name: area.nafn ?? '',
    }))
  }

  async createLists({
    collectionId,
    owner,
    areas,
  }: CreateListInput): Promise<Slug> {
    const { id, isActive } = await this.currentCollectionInfo()
    // check if collectionId is current collection and current collection is open
    if (collectionId !== id.toString() || !isActive) {
      throw new Error('Collection is not open')
    }

    const collectionAreas = await this.getAreas(id)
    const filteredAreas = areas
      ? collectionAreas.filter((area) =>
          areas.flatMap((a) => parseInt(a.areaId)).includes(area.id),
        )
      : collectionAreas

    const lists = await this.listsApi.medmaelalistarAddListarPost({
      medmaelalistiRequestDTO: {
        sofnunID: id,
        kennitala: owner.nationalId,
        simi: owner.phone,
        netfang: owner.email,
        medmaelalistar: filteredAreas.map((area) => ({
          svaediID: area.id,
          listiNafn: `${owner.name} - ${area.name}`,
        })),
      },
    })
    if (filteredAreas.length !== lists.length) {
      throw new Error('Not all lists created')
    }
    const { slug } = mapList(lists[0])
    return { slug }
  }

  async signList(listId: string, auth: User): Promise<Signature> {
    const signature = await this.getApiWithAuth(
      this.listsApi,
      auth,
    ).medmaelalistarIDAddMedmaeliPost({
      kennitala: auth.nationalId,
      iD: parseInt(listId),
    })
    return mapSignature(signature)
  }

  async unsignList(listId: string, auth: User): Promise<Success> {
    const { signature } = await this.getSignee(auth)
    if (!signature || signature.listId !== listId || !signature.id) {
      return { success: false, reasons: [ReasonKey.SignatureNotFound] }
    }
    const signatureRemoved =
      await this.signatureApi.medmaeliIDRemoveMedmaeliUserPost({
        iD: parseInt(signature.id),
      })
    return { success: !!signatureRemoved }
  }

  async removeLists(
    collectionId: string,
    auth: User,
    listIds?: string[],
  ): Promise<Success> {
    const { id, isPresidential, isActive } = await this.currentCollectionInfo()
    const { ownedLists, candidate } = await this.getSignee(auth)
    const { nationalId } = auth
    if (candidate?.nationalId !== nationalId || !candidate.id) {
      return { success: false, reasons: [ReasonKey.NotOwner] }
    }
    // Lists can only be removed from current collection if it is open
    if (id !== parseInt(collectionId) || !isActive) {
      return { success: false, reasons: [ReasonKey.CollectionNotOpen] }
    }
    // For presidentail elections remove all lists for owner, else remove selected lists
    if (isPresidential) {
      await this.candidateApi.frambodIDRemoveFrambodUserPost({
        iD: parseInt(candidate.id),
      })
      return { success: true }
    }
    if (!listIds || listIds.length === 0) {
      return { success: false, reasons: [ReasonKey.NoListToRemove] }
    }
    if (!ownedLists || ownedLists.length === 0) {
      return { success: false, reasons: [ReasonKey.NoListToRemove] }
    }
    const listsToRemove = ownedLists.filter((list) => listIds.includes(list.id))
    if (listsToRemove.length === 0) {
      return { success: false, reasons: [ReasonKey.NoListToRemove] }
    }

    listsToRemove.map(
      async (list) =>
        await this.getApiWithAuth(
          this.listsApi,
          auth,
        ).medmaelalistarIDRemoveMedmaelalistiUserPost({
          iD: parseInt(list.id),
        }),
    )
    return { success: true }
  }

  async getSignedList(auth: User): Promise<List | null> {
    const { signature } = await this.getSignee(auth)
    if (!signature) {
      return null
    }
    return this.getList(signature.listId, auth)
  }

  async canSign({
    requirementsMet = false,
    canSignInfo,
    isActive,
    activeSignature,
  }: CanSignInput): Promise<Success> {
    const reasons = mapReasons({
      ...canSignInfo,
      active: isActive,
      notSigned: activeSignature === undefined,
    })
    return { success: requirementsMet && isActive && !activeSignature, reasons }
  }

  async canCreate({
    requirementsMet = false,
    canCreateInfo,
    isPresidential,
    isActive,
    ownedLists,
  }: CanCreateInput): Promise<Success> {
    // can create if requirements met and collection is active
    // if collection is presidential and user has no lists otherwise does not have lists for all areas of collection
    const alreadyOwnsAllLists = isPresidential
      ? ownedLists.length > 0
      : await this.getAreas().then(
          (areas) => areas.length === ownedLists.length,
        )

    const canCreate = requirementsMet && isActive && !alreadyOwnsAllLists
    const reasons =
      mapReasons({
        ...canCreateInfo,
        active: isActive,
        notOwner: !alreadyOwnsAllLists,
      }) ?? []
    return { success: canCreate, reasons }
  }

  async getSignee(auth: User, nationalId?: string): Promise<Signee> {
    const collection = await this.currentCollectionInfo()
    const { id, isPresidential, isActive } = collection
    const user = await this.getApiWithAuth(
      this.collectionsApi,
      auth,
    ).medmaelasofnunIDEinsInfoKennitalaGet({
      kennitala: nationalId ?? auth.nationalId,
      iD: id,
    })
    const candidate = user.frambod ? mapCandidate(user.frambod) : undefined

    const activeSignature = user.medmaeli?.find((signature) => signature.valid)
    const ownedLists =
      user.medmaelalistar && candidate
        ? user.medmaelalistar?.map((list) =>
            mapListBase(list, candidate, collection),
          )
        : []

    const { success: canCreate, reasons: canCreateInfo } = await this.canCreate(
      {
        requirementsMet: user.maFrambod,
        canCreateInfo: user.maFrambodInfo,
        ownedLists,
        isPresidential,
        isActive,
      },
    )
    const { success: canSign, reasons: canSignInfo } = await this.canSign({
      requirementsMet: user.maKjosa,
      isActive,
      canSignInfo: user.maKjosaInfo,
      activeSignature,
    })
    return {
      nationalId: user.kennitala ?? '',
      name: user.nafn ?? '',
      electionName: user.kosningNafn ?? '',
      canSign,
      canSignInfo,
      canCreate,
      canCreateInfo,
      area: user.svaedi && {
        id: user.svaedi?.id?.toString() ?? '',
        name: user.svaedi?.nafn?.toString() ?? '',
      },
      signature: activeSignature ? mapSignature(activeSignature) : undefined,
      ownedLists,
      isOwner: user.medmaelalistar ? user.medmaelalistar?.length > 0 : false,
      candidate,
    }
  }

  async delegateList(listId: number, nationalId: string): Promise<List> {
    const res = await this.listsApi.medmaelalistarIDAddUmbodPost({
      iD: listId,
      kennitala: nationalId,
    })
    return mapList(res)
  }
}
