import fetch from 'isomorphic-fetch'

import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'
import { ActiveApplicationModel } from '../application'

@Injectable()
export class UserService {
  async checkHasAppliedForPeriod(
    nationalId: string,
  ): Promise<ActiveApplicationModel[]> {
    const res = await fetch(
      `${environment.backend.url}/api/hasAppliedForPeriod/?nationalId=${nationalId}`,
      {
        headers: { authorization: `Bearer ${environment.auth.secretToken}` },
      },
    )
    return await res.json()
  }
}
