import { AdminAccessDTO } from '../entities/dtos/admin-acess.dto'
import { AdminAccess } from '../entities/models/admin-access.model'
import { BaseService } from './BaseService'

export class AdminAccessService extends BaseService {
  /** Gets Admin User by nationalId */
  static async findOne(nationalId: string): Promise<AdminAccess> {
    return BaseService.GET(`admin-access/${encodeURIComponent(nationalId)}`)
  }

  /** Gets list of Admin Users*/
  static async findAndCountAll(
    searchString,
    page,
    count,
  ): Promise<{ rows: AdminAccess[]; count: number } | null> {
    return BaseService.GET(
      `admin-access?searchString=${encodeURIComponent(
        searchString,
      )}&page=${page}&count=${count}`,
    )
  }

  /** Creates a new admin */
  static async create(acess: AdminAccessDTO): Promise<AdminAccess> {
    return BaseService.POST('admin-access', acess)
  }

  /** Updates an existing admin */
  static async update(
    nationalId: string,
    access: AdminAccessDTO,
  ): Promise<AdminAccess | null> {
    delete access.nationalId
    return await BaseService.PUT(
      `admin-access/${encodeURIComponent(nationalId)}`,
      access,
    )
  }

  /** Deleting an admin by nationalId */
  static async delete(nationalId: string): Promise<number> {
    return await BaseService.DELETE(
      `admin-access/${encodeURIComponent(nationalId)}`,
    )
  }
}
