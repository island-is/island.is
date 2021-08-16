import fetch from 'isomorphic-fetch'

import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'

@Injectable()
export class UserService {
  async checkUserHistory(nationalId: string): Promise<boolean> {
    const res = await fetch(
      `${environment.backend.url}/api/me/?nationalId=${nationalId}`,
      {
        headers: { authorization: `Bearer ${environment.auth.secretToken}` },
      },
    )
    return await res.json()
  }

  // async getApplicationId(nationalId: string): Promise<boolean> {
  //   // const res = await fetch(
  //   //   `${environment.backend.url}/api/me/?nationalId=${nationalId}`,
  //   //   {
  //   //     headers: { authorization: `Bearer ${environment.auth.secretToken}` },
  //   //   },
  //   // )
  //   return 'bla'
  // }
}
