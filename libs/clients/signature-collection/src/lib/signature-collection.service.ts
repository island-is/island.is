import { Injectable } from '@nestjs/common'
import {
  EinstaklingurKosningInfoDTO,
  KosningApi,
  MedmaelalistarApi,
  MedmaelasofnunApi,
  MedmaeliApi,
} from '../../gen/fetch'
import { AreaInput } from './signature-collection.types'
import { Collection } from './types/collection.dto'
import { List, mapList } from './types/list.dto'
import { Signature, mapSignature } from './types/signature.dto'
import { Signee } from './types/user.dto'
import { BulkUpload } from './types/bulkUpload.dto'

@Injectable()
export class SignatureCollectionClientService {
  constructor(
    private electionsApi: KosningApi,
    private listsApi: MedmaelalistarApi,
    private collectionsApi: MedmaelasofnunApi,
    private signatureApi: MedmaeliApi,
  ) {}

  async currentCollectionId(): Promise<number> {
    // TODO: Will be updated to include optional election type caategory so that we can get just active or most recent collection of type
    const res = await this.collectionsApi.medmaelasofnunGet({
      includeInactive: false,
    })
    const now = new Date()
    const curr = res.find(({ sofnunStart, sofnunEnd, id }) => {
      if (!sofnunStart || !sofnunEnd || !id) {
        console.log('missing data')
        return false
      }
      return sofnunEnd > now && sofnunStart < now
    })
    if (!curr?.id) {
      throw new Error('No current collection')
    }
    return curr.id
  }

  //   Current Collection
  async getCurrentCollection(): Promise<Collection> {
    const id = await this.currentCollectionId()

    const currentCollection = await this.collectionsApi.medmaelasofnunIDGet({
      iD: id,
    })

    return {
      id: currentCollection.id?.toString() ?? '',
      name: currentCollection.kosningNafn ?? '',
      startTime: currentCollection.sofnunStart ?? new Date(),
      endTime: currentCollection.sofnunEnd ?? new Date(),
      areas:
        currentCollection.svaedi?.map(({ id, nafn, fjoldi }) => ({
          id: id?.toString() ?? '',
          name: nafn ?? '',
          min: fjoldi ?? 0,
        })) ?? [],
    }
  }

  // - Get Lists:
  //   - AllLists
  //   - AllOpenLists
  //   - ListsByArea
  //   - ListsByOwner

  async getLists({ areaId, nationalId }: AreaInput): Promise<List[]> {
    // TODO: owner will be added as optional param add when ready
    const id = await this.currentCollectionId()
    const params = areaId
      ? { sofnunID: id, svaediID: parseInt(areaId), frambodKennitala: nationalId }
      : { sofnunID: id, frambodKennitala: nationalId }

    const lists = await this.listsApi.medmaelalistarGet(params)
    // if (nationalId) {
    //   lists = lists.filter((list) => list.frambod?.kennitala === nationalId)
    // }
    return lists.map((list) => mapList(list))
  }

  //   List
  async getList(listId: string): Promise<List> {
    const list = await this.listsApi.medmaelalistarIDGet({
      iD: parseInt(listId),
    })
    return mapList(list)
  }

  //   Get Signatures
  async getSignatures(listId: string): Promise<Signature[]> {
    const signatures = await this.listsApi.medmaelalistarIDMedmaeliGet({
      iD: parseInt(listId),
    })
    // console.log(signatures)missing name, active
    return signatures.map((signature) => mapSignature(signature))
  }

  async getAreas(collectionId: number) {
    // const collectionId = await this.currentCollectionId()
    const areas = await this.collectionsApi.medmaelasofnunIDSvaediGet({
      iD: collectionId,
    })
    return areas.map((area) => ({
      id: area.id ?? 0,
      name: area.nafn ?? '',
    }))
  }

  //   Create
  async createLists(nationalId: string): Promise<List[]> {
    // TODO: get areas if forseta otherwise input areas
    // TODO: is missing phone and email fields
    const id = await this.currentCollectionId()
    const areas = await this.getAreas(id)
    const lists = await this.listsApi.medmaelalistarAddListarPost({
      medmaelalistiRequestDTO: {
        sofnunID: id,

        kennitala: nationalId,
        medmaelalistar: areas.map((area) => ({
          svaediID: area.id,
          listiNafn: area.name + ' test',
        })),
      },
    })
    return lists.map((list) => mapList(list))
  }

  //   Sign
  async signList(listId: string, nationalId: string): Promise<Signature> {
    const signature = await this.listsApi.medmaelalistarIDAddMedmaeliPost({
      kennitala: nationalId,
      iD: parseInt(listId),
    })
    return mapSignature(signature)
  }
  //   Unsign
  async unsignList(signatureId: string): Promise<Signature> {
    // TODO: chagne to simple success if signature returned
    const signature = await this.signatureApi.medmaeliIDRemoveMedmaeliUserPost({
      iD: parseInt(signatureId),
    })
    return mapSignature(signature)
  }
  //   Cancel - Delete all lists

  // EinsInfo
  async getUser(nationalId: string): Promise<EinstaklingurKosningInfoDTO> {
    const id = await this.currentCollectionId()
    return await this.collectionsApi.medmaelasofnunIDEinsInfoKennitalaGet({
      kennitala: nationalId,
      iD: id,
    })
  }

  //   SignedList
  async getSignedList(nationalId: string): Promise<List | null> {
    const { signature } = await this.getSignee(nationalId)
    if (!signature || signature.length === 0) {
      return null
    }
    // TODO: find active signature
    return this.getList(signature[0].listId)
  }

  //   CanSign
  async canSign(nationalId: string): Promise<{ success: boolean }> {
    const { canSign } = await this.getSignee(nationalId)
    //  TODO: map errors
    return { success: canSign }
  }
  //   Signee
  async getSignee(nationalId: string): Promise<Signee> {
    const id = await this.currentCollectionId()
    console.log({
      kennitala: nationalId,
      sofnunID: id,
    })
    const user = await this.collectionsApi.medmaelasofnunIDEinsInfoKennitalaGet({
      kennitala: nationalId,
      iD: id,
    })
    // TODO: Look into active signature
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
      ownedLists: user.medmaelalistar?.map((list) => mapList(list)) ?? [],
    }
  }

  //   CanCreate
  async canCreate(nationalId: string): Promise<{ success: boolean }> {
    // TODO: update when api returns correct data
    const { canCreate } = await this.getSignee(nationalId)
    return { success: canCreate }
  }
  //   IsOwner
  async isOwner(nationalId: string): Promise<{ success: boolean }> {
    const { ownedLists } = await this.getSignee(nationalId)
    return { success: ownedLists.length > 0 }
  }

  //   FindSignature

  //   CompareLists
  // TODO: scope admin

  //   - DelegateList
  // TODO: check if owner
  //   - UndelegateList
  // TODO: check if owner
  //   - ExtendDeadline
  async extendDeadline(listId: string, newEndDate: Date): Promise<List> {
  // TODO: scope admin

    const list = await this.listsApi.medmaelalistarIDExtendTimePatch({
      iD: parseInt(listId),
      newEndDate: new Date(),
    })
    return mapList(list)
  }
  //   - BulkUploadSignatures
  async bulkUploadSignatures(
    listId: string,
    nationalIds: string[],
  ): Promise<BulkUpload> {
  // TODO: scope admin
  
      const signatures = await this.listsApi.medmaelalistarIDAddMedmaeliBulkPost({
        iD: parseInt(listId),
        requestBody: nationalIds
      })
      console.log(signatures)
      return {
        success: signatures?.medmaeli?.map((signature) => mapSignature(signature)) ?? [],
        failed: [...signatures.notFound?.map((nationalId) => ({ nationalId, reason: 'Kennitala fannst ekki' })) ?? [],
        ...signatures.undirAldri?.map((nationalId) => ({ nationalId, reason: 'Undir Aldri' })) ?? [],
        ...signatures.ekkiASvaedi?.map((nationalId) => ({ nationalId, reason: 'Ekki á svæði' })) ?? [],
        ...signatures.ekkiIsRik?.map((nationalId) => ({ nationalId, reason: 'ekkiIsRik' })) ?? [],],
      }
    }
}
