import { IdpProviderDTO } from '../entities/dtos/idp-provider.dto'
import { IdpProvider } from '../entities/models/IdpProvider.model'
import { BaseService } from './BaseService'

export class IdpProviderService extends BaseService {
  /** Gets all IDP Providers */
  static findAndCountAll(
    searchString: string,
    page: number,
    count: number,
  ): Promise<{ rows: IdpProvider[]; count: number } | null> {
    return BaseService.GET(
      `idp-provider/?searchString=${encodeURIComponent(
        searchString,
      )}&page=${page}&count=${count}`,
    )
  }

  /** Gets an IDP Provider by name */
  static findByName(name: string): Promise<IdpProvider | null> {
    return BaseService.GET(`idp-provider/${encodeURIComponent(name)}`)
  }

  /** Create a new IDP Provider */
  static create(idpProvider: IdpProviderDTO): Promise<IdpProvider | null> {
    return BaseService.POST(`idp-provider`, idpProvider)
  }

  /** Update a IDP Provider */
  static update(
    name: string,
    idpProvider: IdpProviderDTO,
  ): Promise<IdpProvider | null> {
    return BaseService.PUT(
      `idp-provider/${encodeURIComponent(name)}`,
      idpProvider,
    )
  }

  /** Update a IDP Provider */
  static delete(name: string): Promise<number | null> {
    return BaseService.DELETE(`idp-provider/${encodeURIComponent(name)}`)
  }
}
