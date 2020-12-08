import { Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'

import { logger } from '@island.is/logging'
import { FamilyMember, User } from './types'
import { NationalRegistryApi } from './soap/nationalRegistryApi'

// eslint-disable-next-line
const handleError = (error: any) => {
  logger.error(error)
  throw new ApolloError('Failed to resolve request', error)
}

@Injectable()
export class NationalRegistryService {
  constructor(private nationalRegistryApi: NationalRegistryApi) {}

  async GetMyinfo(nationalId: string): Promise<User> {
    return await this.nationalRegistryApi
      .getMyInfo(nationalId)
      .catch(handleError)
  }

  async GetMyFamily(nationalId: string): Promise<FamilyMember[]> {
    return await this.nationalRegistryApi
      .getMyFamily(nationalId)
      .catch(handleError)
  }
}
