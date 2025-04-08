import { Injectable } from '@nestjs/common'
import { BloodApi } from '../../gen/fetch'
import { User } from '@island.is/auth-nest-tools'
import { BloodTypeDto, mapBloodTypeDto } from './dtos/bloodTypes.dto'

@Injectable()
export class BloodClientService {
  constructor(private readonly api: BloodApi) {}

  getBloodType = async (user: User): Promise<BloodTypeDto | null> => {
    const bloodType = await this.api.apiNationalIdBloodGet({
      nationalId: user.nationalId,
    })

    if (!bloodType) {
      return null
    }

    return mapBloodTypeDto(bloodType)
  }
}
