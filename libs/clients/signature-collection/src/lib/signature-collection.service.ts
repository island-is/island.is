import { Injectable } from '@nestjs/common'
import {
  EinstaklingurKosningInfoDTO,
  FrambodApi,
  MedmaelalistarApi,
  MedmaelasofnunApi,
  MedmaeliApi,
  MedmaeliBulkItemDTO,
} from '../../gen/fetch'
import {
  GetListInput,
  CreateListInput,
  ReasonKey,
  BulkUploadInput,
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
import { BulkUpload } from './types/bulkUpload.dto'

import { Success, mapReasons } from './types/success.dto'
import { mapCandidate } from './types/candidate.dto'
import { Slug } from './types/slug.dto'

@Injectable()
export class SignatureCollectionClientService {
  constructor(
    private listsApi: MedmaelalistarApi,
    private collectionsApi: MedmaelasofnunApi,
    private signatureApi: MedmaeliApi,
    private candidateApi: FrambodApi,
  ) {}

  async currentCollectionInfo(): Promise<CollectionInfo> {
    // includeInactive: false will return collections as active until electionday for collection has passed
    const res = await this.collectionsApi.medmaelasofnunGet({
      includeInactive: false,
    })
    const current = (
      res
        .map(mapCollectionInfo)
        .filter((collection) => !!collection) as CollectionInfo[]
    ).sort((a, b) => (a.endTime > b.endTime ? 1 : -1))[0]

    if (!current) {
      throw new Error('No current collection')
    }
    return current
  }

  async getCurrentCollection(): Promise<Collection> {
    const { id } = await this.currentCollectionInfo()

    const currentCollection = await this.collectionsApi.medmaelasofnunIDGet({
      iD: id,
    })
    return mapCollection(currentCollection)
  }

  async getListsParams({ areaId, nationalId, candidateId }: GetListInput) {
    const { id } = await this.currentCollectionInfo()
    if (nationalId) {
      const { isOwner, area, candidate } = await this.getSignee(nationalId)
      if (isOwner && candidate) {
        // TODO: check if actor and if type collection not presidentional send in area of actor
        return areaId
          ? {
              sofnunID: id,
              frambodID: parseInt(candidate.id),
              svaediID: parseInt(areaId),
            }
          : { sofnunID: id, frambodID: parseInt(candidate.id) }
      } else if (area) {
        return {
          sofnunID: id,
          svaediID: parseInt(area?.id),
          frambodID: candidateId ? parseInt(candidateId) : undefined,
        }
      }
    }
    return {
      sofnunID: id,
      svaediID: areaId ? parseInt(areaId) : undefined,
      frambodID: candidateId ? parseInt(candidateId) : undefined,
    }
  }

  async getLists(input: GetListInput): Promise<List[]> {
    const params = await this.getListsParams(input)
    const lists = await this.listsApi.medmaelalistarGet(params)
    return lists.map((list) => mapList(list))
  }

  async getList(listId: string): Promise<List> {
    const list = await this.listsApi.medmaelalistarIDGet({
      iD: parseInt(listId),
    })
    return mapList(list)
  }

  async getSignatures(listId: string): Promise<Signature[]> {
    const signatures = await this.listsApi.medmaelalistarIDMedmaeliGet({
      iD: parseInt(listId),
    })
    return signatures.map((signature) => mapSignature(signature))
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
    // TODO: check delegations

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
          listiNafn: `${owner.name} ${area.name}`,
        })),
      },
    })
    if (filteredAreas.length !== lists.length) {
      throw new Error('Not all lists created')
    }
    const { slug } = mapList(lists[0])
    return { slug }
  }

  async signList(listId: string, nationalId: string): Promise<Signature> {
    const signature = await this.listsApi.medmaelalistarIDAddMedmaeliPost({
      kennitala: nationalId,
      iD: parseInt(listId),
    })
    return mapSignature(signature)
  }

  async unsignList(listId: string, nationalId: string): Promise<Success> {
    const { signature } = await this.getSignee(nationalId)
    if (!signature || signature.listId !== listId || !signature.id) {
      return { success: false, reasons: [ReasonKey.SignatureNotFound] }
    }
    const signatureRemoved =
      await this.signatureApi.medmaeliIDRemoveMedmaeliUserPost({
        iD: parseInt(signature.id),
      })
    return { success: !!signatureRemoved }
  }

  async unsignListAdmin(signatureId: string): Promise<Success> {
    const signature = await this.signatureApi.medmaeliIDRemoveMedmaeliAdminPost(
      {
        iD: parseInt(signatureId),
      },
    )
    return { success: !!signature }
  }

  async removeLists(
    collectionId: string,
    nationalId: string,
    listIds?: string[],
  ): Promise<Success> {
    const { id, isPresidential, isActive } = await this.currentCollectionInfo()
    const { ownedLists, candidate } = await this.getSignee(nationalId)
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
        await this.listsApi.medmaelalistarIDRemoveMedmaelalistiUserPost({
          iD: parseInt(list.id),
        }),
    )
    return { success: true }
  }

  async getUser(nationalId: string): Promise<EinstaklingurKosningInfoDTO> {
    const { id } = await this.currentCollectionInfo()
    return await this.collectionsApi.medmaelasofnunIDEinsInfoKennitalaGet({
      kennitala: nationalId,
      iD: id,
    })
  }

  async getSignedList(nationalId: string): Promise<List | null> {
    const { signature } = await this.getSignee(nationalId)
    if (!signature) {
      return null
    }
    return this.getList(signature.listId)
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

  async getSignee(nationalId: string): Promise<Signee> {
    const collection = await this.currentCollectionInfo()
    const { id, isPresidential, isActive } = collection
    const user = await this.collectionsApi.medmaelasofnunIDEinsInfoKennitalaGet(
      {
        kennitala: nationalId,
        iD: id,
      },
    )
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

  async isOwner(nationalId: string): Promise<{ success: boolean }> {
    const { isOwner } = await this.getSignee(nationalId)
    return { success: isOwner }
  }

  async compareBulkSignaturesOnList(
    listId: string,
    nationalIds: string[],
  ): Promise<Signature[]> {
    // Takes a list of nationalIds listId and returns signatures found on list
    const signaturesFound = await this.listsApi.medmaelalistarIDComparePost({
      iD: parseInt(listId),
      requestBody: nationalIds,
    })
    return signaturesFound.map(mapSignature)
  }

  async compareBulkSignaturesOnAllLists(
    nationalIds: string[],
  ): Promise<Signature[]> {
    // Takes a list of nationalIds and returns signatures found on any list in current collection
    const { id } = await this.currentCollectionInfo()
    const signaturesFound =
      await this.collectionsApi.medmaelasofnunIDComparePost({
        iD: id,
        requestBody: nationalIds,
      })
    return signaturesFound.map(mapSignature)
  }

  //   TODO: DelegateList
  //   TODO: UndelegateList

  async extendDeadline(listId: string, newEndDate: Date): Promise<List> {
    const list = await this.listsApi.medmaelalistarIDExtendTimePatch({
      iD: parseInt(listId),
      newEndDate: newEndDate,
    })
    return mapList(list)
  }

  async bulkUploadSignatures({
    listId,
    upload,
  }: BulkUploadInput): Promise<BulkUpload> {
    const medmaeli: MedmaeliBulkItemDTO[] = upload.map((user) => ({
      kennitala: user.nationalId,
      bladsida: user.pageNumber,
    }))
    const signatures = await this.listsApi.medmaelalistarIDAddMedmaeliBulkPost({
      iD: parseInt(listId),
      medmaeliBulkRequestDTO: { medmaeli },
    })
    return {
      success:
        signatures?.medmaeli?.map((signature) => mapSignature(signature)) ?? [],
      failed: [
        ...(signatures.medMedmaeliALista?.map((nationalId) => ({
          nationalId,
          reason: 'Þegar meðmæli á lista',
        })) ?? []),
        ...(signatures.notFound?.map((nationalId) => ({
          nationalId,
          reason: 'Kennitala fannst ekki',
        })) ?? []),
        ...(signatures.undirAldri?.map((nationalId) => ({
          nationalId,
          reason: 'Undir Aldri',
        })) ?? []),
        ...(signatures.ekkiASvaedi?.map((nationalId) => ({
          nationalId,
          reason: 'Ekki á svæði',
        })) ?? []),
        ...(signatures.ekkiIsRik?.map((nationalId) => ({
          nationalId,
          reason: 'Ekki með íslenskt ríkisfang',
        })) ?? []),
      ],
    }
  }
}
