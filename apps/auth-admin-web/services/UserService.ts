import UserIdentity from '../entities/models/user-identity.model'
import { BaseService } from './BaseService'

export class UserService extends BaseService {
  static async findUser(searhString: string): Promise<UserIdentity[] | null> {
    return BaseService.GET(`user-identities/${searhString}`)
  }

  static async toggleActive(
    subjectId: string,
    active: boolean,
  ): Promise<UserIdentity | null> {
    return BaseService.PATCH(`user-identities/${subjectId}`, {
      active: active,
    })
  }
}
