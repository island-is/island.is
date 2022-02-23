import { GrantTypeDTO } from '../entities/dtos/grant-type.dto'
import { GrantType } from '../entities/models/grant-type.model'
import { BaseService } from './BaseService'

export class GrantTypeService extends BaseService {
  /** Searches all Grant Types */
  static findAndCountAll(
    searchString: string,
    page: number,
    count: number,
  ): Promise<{ rows: GrantType[]; count: number } | null> {
    return BaseService.GET(
      `grants/search/?searchString=${encodeURIComponent(
        searchString,
      )}&page=${page}&count=${count}`,
    )
  }

  /** Gets all Grant Types  */
  static async findAll(): Promise<GrantType[] | null> {
    return BaseService.GET(`grants`)
  }

  /** Get by name */
  static async findByName(name: string): Promise<GrantType | null> {
    return BaseService.GET(`grants/type/${encodeURIComponent(name)}`)
  }

  /** Create a Grant Type  */
  static async create(grantType: GrantTypeDTO): Promise<GrantType | null> {
    return BaseService.POST(`grants`, grantType)
  }

  /** Update a Grant Type  */
  static async update(
    grantType: GrantTypeDTO,
    name: string,
  ): Promise<GrantType | null> {
    return BaseService.PUT(`grants/${encodeURIComponent(name)}`, grantType)
  }

  /** Soft deleta a Grant Type  */
  static async delete(name: string): Promise<number | null> {
    return BaseService.DELETE(`grants/${encodeURIComponent(name)}`)
  }
}
