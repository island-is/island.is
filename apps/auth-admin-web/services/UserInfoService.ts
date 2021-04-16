import { getSession } from 'next-auth/client'
import api from './IdentityServerApi'
import { BaseService } from './BaseService'
import UserInfo from '../entities/models/user-info.model'

export class UserInfoService {
  static async getUserInfo(): Promise<UserInfo | null> {
    const session = await getSession()
    const response = await api.get(
      'connect/userInfo',
      BaseService.getConfig(session),
    )
    return response.data as UserInfo
  }
}
