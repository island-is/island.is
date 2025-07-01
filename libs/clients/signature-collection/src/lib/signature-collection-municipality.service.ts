import { Injectable } from '@nestjs/common'
import {
  MunicipalityAdminApi,
  MunicipalityCandidateApi,
  MunicipalityListApi,
} from './apis'
import { SignatureCollectionSharedClientService } from './signature-collection-shared.service'
import { KosningApi, MedmaelasofnunApi } from '../../gen/fetch'
import { SignatureCollectionAdminClientService } from './signature-collection-admin.service'
import { Auth } from '@island.is/auth-nest-tools'
import { Collection, CollectionType } from './types/collection.dto'
import { GetListInput } from './signature-collection.types'
import { List } from './types/list.dto'

@Injectable()
export class SignatureCollectionMunicipalityClientService extends SignatureCollectionAdminClientService {
  constructor(
    adminApi: MunicipalityAdminApi,
    electionsApi: KosningApi,
    sharedService: SignatureCollectionSharedClientService,
    listsApi: MunicipalityListApi,
    collectionApi: MedmaelasofnunApi,
    candidateApi: MunicipalityCandidateApi,
  ) {
    super(
      listsApi,
      collectionApi,
      electionsApi,
      sharedService,
      candidateApi,
      adminApi,
    )
  }

  override async getLatestCollectionForType(
    auth: Auth,
    collectionType: CollectionType,
  ): Promise<Collection> {
    const collection = await this.sharedService.getLatestCollectionForType(
      this.getApiWithAuth(this.electionsApi, auth),
      collectionType,
    )
    const areaId = await this.getMunicipalityAreaId(auth)
    collection.areas = collection.areas.filter((area) => area.id === areaId)
    collection.candidates = collection.candidates.filter(
      (candidate) => candidate.areaId === areaId,
    )
    return collection
  }

  override async getLists(input: GetListInput, auth: Auth): Promise<List[]> {
    if (
      input.collectionType &&
      input.collectionType === CollectionType.LocalGovernmental
    ) {
      input.areaId = await this.getMunicipalityAreaId(auth)
    }
    return await this.sharedService.getLists(
      input,
      this.getApiWithAuth(this.listsApi, auth),
      this.getApiWithAuth(this.electionsApi, auth),
    )
  }
}
