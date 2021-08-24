import fetch from 'isomorphic-fetch'

import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'
import { CurrentApplicationModel } from '../application'

@Injectable()
export class UserService {
  async checkHasCurrentApplication(
    nationalId: string,
  ): Promise<CurrentApplicationModel | null> {
    const res = await fetch(
      `${environment.backend.url}/api/hasCurrentApplication/?nationalId=${nationalId}`,
      {
        headers: { authorization: `Bearer ${environment.auth.secretToken}` },
      },
    )

    const text = await res.text()

    if (text.length) {
      return JSON.parse(text)
    }
    return null
  }
}
