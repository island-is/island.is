import { Injectable } from '@nestjs/common'
import {
  EinstaklingurKosningInfoDTO,
  MedmaelalistarApi,
  MedmaelasofnunApi,
  MedmaeliApi,
} from '../../gen/fetch'
import { GetListInput, CreateListInput } from './signature-collection.types'
import {
  Collection,
  mapCollectionInfo,
  CollectionInfo,
  mapCollection,
} from './types/collection.dto'
import { List, mapList } from './types/list.dto'
import { Signature, mapSignature } from './types/signature.dto'
import { Signee } from './types/user.dto'
import { BulkUpload } from './types/bulkUpload.dto'

import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class SignatureCollectionClientService {
  constructor(
    private listsApi: MedmaelalistarApi,
    private collectionsApi: MedmaelasofnunApi,
    private signatureApi: MedmaeliApi,
  ) {}

  async currentCollectionInfo(): Promise<CollectionInfo> {
    // TODO: Will be updated to include optional election type category so that we can get just active or most recent collection of type
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

  async getListsParams({ areaId, nationalId }: GetListInput) {
    const { id } = await this.currentCollectionInfo()
    if (nationalId) {
      const { isOwner, area } = await this.getSignee(nationalId)
      if (isOwner) {
        // TODO: check if actor and if type collection not presidentional send in area of actor
        return { sofnunID: id, frambodKennitala: nationalId }
      } else if (area) {
        return { sofnunID: id, svaediID: parseInt(area?.id) }
      }
    }
    return {
      sofnunID: id,
      svaediID: areaId ? parseInt(areaId) : undefined,
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

  async getAreas(collectionId: number) {
    // const collection{Id} = await this.currentCollectionInfo()
    const areas = await this.collectionsApi.medmaelasofnunIDSvaediGet({
      iD: collectionId,
    })
    return areas.map((area) => ({
      id: area.id ?? 0,
      name: area.nafn ?? '',
    }))
  }

  async createLists(
    { collectionId, owner, areas }: CreateListInput,
    user: User,
  ): Promise<List[]> {
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
    return lists.map((list) => mapList(list))
  }

  async signList(listId: string, nationalId: string): Promise<Signature> {
    const signature = await this.listsApi.medmaelalistarIDAddMedmaeliPost({
      kennitala: nationalId,
      iD: parseInt(listId),
    })
    return mapSignature(signature)
  }

  async unsignList(signatureId: string): Promise<{ success: boolean }> {
    const signature = await this.signatureApi.medmaeliIDRemoveMedmaeliUserPost({
      iD: parseInt(signatureId),
    })
    return { success: !!signature }
  }

  async removeLists(
    collectionId: string,
    nationalId: string,
    listIds?: string[],
  ): Promise<{ success: boolean }> {
    const { id, isPresidential, isActive } = await this.currentCollectionInfo()
    // TODO: Error mapping
    // Lists can only be removed from current collection if it is open
    if (id !== parseInt(collectionId) || !isActive) {
      return { success: false }
    }
    // For presidentail elections remove all lists for owner, else remove selected lists
    if (isPresidential) {
      await this.collectionsApi.medmaelasofnunIDRemoveFrambodKennitalaPost({
        iD: id,
        kennitala: nationalId,
      })
      return { success: true }
    }
    if (!listIds || listIds.length === 0) {
      return { success: false }
    }
    const { ownedLists } = await this.getSignee(nationalId)
    if (!ownedLists || ownedLists.length === 0) {
      return { success: false }
    }
    const listsToRemove = ownedLists.filter((list) => listIds.includes(list.id))
    if (listsToRemove.length === 0) {
      return { success: false }
    }
    // TODO: check if all where successfully removed
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
    if (!signature || signature.length === 0) {
      return null
    }
    // TODO: find active signature when skra updates api
    return this.getList(signature[0].listId)
  }

  async canSign(nationalId: string): Promise<{ success: boolean }> {
    const { canSign } = await this.getSignee(nationalId)
    //  TODO: map errors and reasons
    return { success: canSign }
  }

  async getSignee(nationalId: string): Promise<Signee> {
    const { id } = await this.currentCollectionInfo()
    const user = await this.collectionsApi.medmaelasofnunIDEinsInfoKennitalaGet(
      {
        kennitala: nationalId,
        iD: id,
      },
    )

    // TODO: find active signature when skra updates api
    return {
      nationalId: user.kennitala ?? '',
      name: user.nafn ?? '',
      electionName: user.kosningNafn ?? '',
      canSign: user.maKjosa ?? false,

      canCreate: user.maFrambod ?? false,
      area: user.svaedi && {
        id: user.svaedi?.id?.toString() ?? '',
        name: user.svaedi?.nafn?.toString() ?? '',
        min: user.svaedi?.fjoldi ?? 999,
      },
      signature:
        user.medmaeli?.map((singature) => mapSignature(singature)) ?? [],
      ownedLists: user.medmaelalistar
        ? user.medmaelalistar?.map((list) => mapList(list))
        : [],
      isOwner: user.medmaelalistar ? user.medmaelalistar?.length > 0 : false,
    }
  }

  async canCreate(nationalId: string): Promise<{ success: boolean }> {
    // TODO: update when api returns correct data
    const { canCreate } = await this.getSignee(nationalId)
    return { success: canCreate }
  }

  async isOwner(nationalId: string): Promise<{ success: boolean }> {
    const { isOwner } = await this.getSignee(nationalId)
    return { success: isOwner }
  }

  async compareBulkSignaturesOnList(
    listId: string,
    nationalIds: string[],
  ): Promise<Signature[]> {
    // TODO: scope admin
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
    // TODO: scope admin
    // Takes a list of nationalIds and returns signatures found on any list in current collection
    const { id } = await this.currentCollectionInfo()
    const signaturesFound =
      await this.collectionsApi.medmaelasofnunIDComparePost({
        iD: id,
        requestBody: nationalIds,
      })
    return signaturesFound.map(mapSignature)
  }

  //   - DelegateList
  // TODO: check if owner
  //   - UndelegateList
  // TODO: check if owner

  async extendDeadline(listId: string, newEndDate: Date): Promise<List> {
    // TODO: scope admin

    const list = await this.listsApi.medmaelalistarIDExtendTimePatch({
      iD: parseInt(listId),
      newEndDate: newEndDate,
    })
    return mapList(list)
  }

  async bulkUploadSignatures(
    listId: string,
    nationalIds: string[],
  ): Promise<BulkUpload> {
    // TODO: scope admin

    const signatures = await this.listsApi.medmaelalistarIDAddMedmaeliBulkPost({
      iD: parseInt(listId),
      requestBody: nationalIds,
    })
    return {
      success:
        signatures?.medmaeli?.map((signature) => mapSignature(signature)) ?? [],
      failed: [
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
          reason: 'ekkiIsRik',
        })) ?? []),
      ],
    }
  }
}
