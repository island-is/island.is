import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'

import { TeachingLicense } from './education.type'
import { MMSApi } from './client'

@Injectable()
export class EducationService {
  constructor(private readonly mmsApi: MMSApi) {}

  async getTeachingLicenses(
    nationalId: User['nationalId'],
  ): Promise<TeachingLicense[]> {
    const teachingLicenses = await this.mmsApi.getTeachingLicenses(nationalId)

    return teachingLicenses.map((teachingLicense) => ({
      id: teachingLicense.id,
    }))
  }
}
