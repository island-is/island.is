import fetch from 'isomorphic-fetch'

import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'
import { CurrentApplicationModel } from '../application'

@Injectable()
export class UserService {
  async getCurrentApplication(
    nationalId: string,
  ): Promise<CurrentApplicationModel | null> {
    //Checks if user has a current application
    const res = await fetch(
      `${environment.backend.url}/api/getCurrentApplication/?nationalId=${nationalId}`,
      {
        headers: { authorization: `Bearer ${environment.auth.secretToken}` },
      },
    ).then((res) => {
      {
        //If failed to reach the backend throws error
        if (!res.ok) {
          throw new Error(
            `failed to check if user has application ${res.status}, ${res.statusText}`,
          )
        }
        return res
      }
    })
    //If no application is found, returns null

    return await res.json().catch(() => {
      return null
    })
  }
}
