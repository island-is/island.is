import fetch from 'isomorphic-fetch'

import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'
import { CurrentApplicationModel } from '../application'

@Injectable()
export class UserService {
  async getCurrentApplication(
    nationalId: string,
  ): Promise<CurrentApplicationModel | null> {
    const res = await fetch(
      `${environment.backend.url}/api/getCurrentApplication/?nationalId=${nationalId}`,
      {
        headers: { authorization: `Bearer ${environment.auth.secretToken}` },
      },
    ).then((res) => {
      {
        if (!res.ok) {
          throw new Error('failed to check if user has application')
        }
        return res
      }
    })

    return await res.json().catch(() => {
      return null
    })
  }
}
