import { ApiScopeUserDTO } from '../entities/dtos/api-scope-user.dto'
import { ApiScopeUser } from '../entities/models/api-scope-user.model'
import { BaseService } from './BaseService'

export class AccessService extends BaseService {
  /** Gets Admin User by nationalId */
  static async findOne(nationalId: string): Promise<ApiScopeUser> {
    return BaseService.GET(`admin-access/${encodeURIComponent(nationalId)}`)
  }

  /** Gets list of Api Scope Users*/
  static async findAndCountAll(
    searchString,
    page,
    count,
  ): Promise<{ rows: ApiScopeUser[]; count: number } | null> {
    return BaseService.GET(
      `admin-access?searchString=${encodeURIComponent(
        searchString,
      )}&page=${page}&count=${count}`,
    )
  }

  /** Creates a new Api Scope User */
  static async create(acess: ApiScopeUserDTO): Promise<ApiScopeUser> {
    return BaseService.POST('admin-access', acess)
  }

  /** Updates an existing Api Scope User */
  static async update(
    nationalId: string,
    access: ApiScopeUserDTO,
  ): Promise<ApiScopeUser | null> {
    delete access.nationalId
    return await BaseService.PUT(
      `admin-access/${encodeURIComponent(nationalId)}`,
      access,
    )
  }

  /** Deleting an Api Scope User by nationalId */
  static async delete(nationalId: string): Promise<number> {
    return await BaseService.DELETE(
      `admin-access/${encodeURIComponent(nationalId)}`,
    )
  }
}
