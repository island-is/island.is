import { Injectable } from '@nestjs/common'
import {
  EinstaklingurKosningInfoDTO,
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

  async getListsParams({ areaId, nationalId }: AreaInput) {
    const id = await this.currentCollectionId()
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

  async getLists(input: AreaInput): Promise<List[]> {
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
    // const collectionId = await this.currentCollectionId()
    const areas = await this.collectionsApi.medmaelasofnunIDSvaediGet({
      iD: collectionId,
    })
    return areas.map((area) => ({
      id: area.id ?? 0,
      name: area.nafn ?? '',
    }))
  }

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

  async signList(listId: string, nationalId: string): Promise<Signature> {
    const signature = await this.listsApi.medmaelalistarIDAddMedmaeliPost({
      kennitala: nationalId,
      iD: parseInt(listId),
    })
    return mapSignature(signature)
  }
  async unsignList(signatureId: string): Promise<Signature> {
    // TODO: chagne to simple success if signature returned
    const signature = await this.signatureApi.medmaeliIDRemoveMedmaeliUserPost({
      iD: parseInt(signatureId),
    })
    return mapSignature(signature)
  }
  //   Cancel - Delete all lists

  async getUser(nationalId: string): Promise<EinstaklingurKosningInfoDTO> {
    const id = await this.currentCollectionId()
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
    // TODO: find active signature
    return this.getList(signature[0].listId)
  }

  async canSign(nationalId: string): Promise<{ success: boolean }> {
    const { canSign } = await this.getSignee(nationalId)
    //  TODO: map errors like in bulk
    return { success: canSign }
  }

  async getSignee(nationalId: string): Promise<Signee> {
    const id = await this.currentCollectionId()
    const user = await this.collectionsApi.medmaelasofnunIDEinsInfoKennitalaGet(
      {
        kennitala: nationalId,
        iD: id,
      },
    )

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
    const id = await this.currentCollectionId()
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
