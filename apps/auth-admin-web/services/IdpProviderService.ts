import { IdpProvider } from '../entities/models/IdpProvider.model'
import { BaseService } from './BaseService'

export class IdpProviderService extends BaseService {
  static findAll(): Promise<IdpProvider[] | null> {
    return BaseService.GET(`idp-provider`)
  }
}
