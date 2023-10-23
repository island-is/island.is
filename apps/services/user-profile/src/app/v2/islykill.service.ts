import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { IslyklarApi, PublicUser } from '@island.is/clients/islykill'

@Injectable()
export class IslykillService {
  constructor(private readonly islyklarApi: IslyklarApi) {}

  async updateIslykillSettings({
    nationalId,
    email,
    phoneNumber,
  }: {
    nationalId: string
    email?: string
    phoneNumber?: string
  }): Promise<PublicUser> {
    return await this.islyklarApi
      .islyklarPut({
        user: {
          ssn: nationalId,
          ...(email && { email }),
          ...(phoneNumber && { mobile: phoneNumber }),
        },
      })
      .then((publicUser) => {
        return publicUser
      })
      .catch(() => {
        throw new InternalServerErrorException(
          'Unable to update islykill settings for user',
        )
      })
  }
}
