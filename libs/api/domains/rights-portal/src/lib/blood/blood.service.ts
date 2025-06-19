import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { BloodClientService } from '@island.is/clients/blood'
import { BloodType } from './models/bloodType.model'

@Injectable()
export class BloodService {
  constructor(private readonly service: BloodClientService) {}

  async getBloodType(user: User): Promise<BloodType | null> {
    const data = await this.service.getBloodType(user)

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
