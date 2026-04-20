import { Injectable, Inject } from '@nestjs/common'
import { LegalGazetteClientService } from '../../../../../clients/legal-gazette/src'
import {
  LegalGazetteCategoriesInput,
  LegalGazetteCategoriesResponse,
} from './models/categories'
import { Auth } from '@island.is/auth-nest-tools'

@Injectable()
export class LegalGazetteService {
  constructor(private legalGazetteClient: LegalGazetteClientService) {}

  async getCategories(
    params: LegalGazetteCategoriesInput,
    user: Auth,
  ): Promise<LegalGazetteCategoriesResponse> {
    return this.legalGazetteClient.getCategories(
      { type: params.typeId, excludeUnassignable: true },
      user,
    )
  }
}
