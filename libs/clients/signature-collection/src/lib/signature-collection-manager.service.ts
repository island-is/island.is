import { Injectable } from '@nestjs/common'
import { ManagerAdminApi, ManagerCandidateApi, ManagerListApi } from './apis'
import { SignatureCollectionSharedClientService } from './signature-collection-shared.service'
import { KosningApi, MedmaelasofnunApi } from '../../gen/fetch'
import { SignatureCollectionAdminClientService } from './signature-collection-admin.service'

@Injectable()
export class SignatureCollectionManagerClientService extends SignatureCollectionAdminClientService {
  constructor(
    listsApi: ManagerListApi,
    electionsApi: KosningApi,
    collectionApi: MedmaelasofnunApi,
    sharedService: SignatureCollectionSharedClientService,
    candidateApi: ManagerCandidateApi,
    adminApi: ManagerAdminApi,
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
