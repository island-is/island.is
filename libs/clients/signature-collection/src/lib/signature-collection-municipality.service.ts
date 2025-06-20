import { Injectable } from '@nestjs/common'
import { MunicipalityAdminApi } from './apis'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { SignatureCollectionSharedClientService } from './signature-collection-shared.service'
import { Success } from './types/success.dto'
import { CollectionType } from './types/collection.dto'
import { KosningApi } from '../../gen/fetch'

type Api = MunicipalityAdminApi | KosningApi

@Injectable()
export class SignatureCollectionMunicipalityClientService {
  constructor(
    private adminApi: MunicipalityAdminApi,
    private electionsApi: KosningApi,
    private sharedService: SignatureCollectionSharedClientService,
  ) {}

  private getApiWithAuth<T extends Api>(api: T, auth: Auth) {
    return api.withMiddleware(new AuthMiddleware(auth)) as T
  }

  async startMunicipalityCollection(
    auth: Auth,
    collectionId: string,
  ): Promise<Success> {
    return this.sharedService.startMunicipalityCollection(
      this.getApiWithAuth(this.adminApi, auth),
      this.getApiWithAuth(this.electionsApi, auth),
      collectionId,
    )
  }
}
