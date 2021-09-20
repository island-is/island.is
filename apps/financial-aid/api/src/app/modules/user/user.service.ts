import fetch from 'isomorphic-fetch'

import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'
import { CurrentApplicationModel } from '../application'
import { StaffModel } from '../staff'

@Injectable()
export class UserService {
  async getCurrentApplication(
    nationalId: string,
  ): Promise<CurrentApplicationModel | null> {
    //Checks if user has a current application
    const res = await this.fetchRequest(
      `getCurrentApplication/?nationalId=${nationalId}`,
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

  private async fetchRequest(path: string) {
    return await fetch(`${environment.backend.url}/api/${path}`, {
      headers: { authorization: `Bearer ${environment.auth.secretToken}` },
    })
  }

  async getStaff(nationalId: string): Promise<StaffModel> {
    return await this.fetchRequest(`staff/${nationalId}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to get staff ${res.status}, ${res.statusText}`,
          )
        }
        return await res.json()
      })
      .catch(() => {
        throw new Error('Failed to get staff')
      })
  }
}
