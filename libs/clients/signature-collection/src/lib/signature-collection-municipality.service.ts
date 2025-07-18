import { Injectable } from '@nestjs/common'
import {
  MunicipalityAdminApi,
  MunicipalityCandidateApi,
  MunicipalityListApi,
} from './apis'
import { SignatureCollectionSharedClientService } from './signature-collection-shared.service'
import { KosningApi, MedmaelasofnunApi } from '../../gen/fetch'
import { SignatureCollectionAdminClientService } from './signature-collection-admin.service'

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
}
