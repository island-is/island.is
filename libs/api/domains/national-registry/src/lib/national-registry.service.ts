import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FamilyMember } from './familyMember.model'
import { MyInfo } from './myInfo.model'
import { NationalRegistryApi } from './soap/nationalRegistryApi'

// eslint-disable-next-line
const handleError = (error: any) => {
  logger.error(error)
  throw new ApolloError('Failed to resolve request', error.response.message)
}

@Injectable()
export class NationalRegistryService {
  constructor(private nationalRegistryApi: NationalRegistryApi) {}

  async GetMyinfo(nationalId: string): Promise<MyInfo | null> {
    return await this.nationalRegistryApi
      .getMyInfo(nationalId)
      .catch(handleError)
  }

  async GetMyFamily(nationalId: string): Promise<FamilyMember[] | null> {
    return await this.nationalRegistryApi
      .getMyFamily(nationalId)
      .catch(handleError)
  }
}
