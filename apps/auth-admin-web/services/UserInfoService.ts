/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { getSession } from 'next-auth/client'
import api from './IdentityServerApi'
import Providers from 'next-auth/providers'
import { BaseService } from './BaseService'

export class UserInfoService {
  static async getUserInfo(): Promise<any | null> {
    const session = await getSession()
    const response = await api.get(
      'connect/userInfo',
      BaseService.getConfig(session),
    )
    console.log(response)

    return response
  }
}
