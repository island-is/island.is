import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { LshClientService } from '@island.is/clients/lsh'
import { BloodType } from './models/bloodType.model'
import { Locale } from '@island.is/shared/types'

@Injectable()
export class BloodService {
  constructor(private readonly service: LshClientService) {}

  async getBloodType(user: User, locale: Locale): Promise<BloodType | null> {
    const data = await this.service.getBloodType(
      user,
      locale === 'is' ? 'is' : 'en',
    )

    if (!data) {
      return null
    }

    return {
      type: data.type,
      registered: data.registered,
      description: data.bloodInfo?.description,
      link: data.bloodInfo?.page,
    }
  }
}
