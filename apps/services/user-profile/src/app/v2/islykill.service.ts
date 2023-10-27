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
    return this.islyklarApi
      .islyklarPut({
        user: {
          ssn: nationalId,
          ...(email && { email }),
          ...(phoneNumber && { mobile: phoneNumber }),
        },
      })
      .then((publicUser) => publicUser)
      .catch((e: Error) => {
        throw new InternalServerErrorException(
          'Unable to update islykill settings for user',
          e.message,
        )
      })
  }
}
