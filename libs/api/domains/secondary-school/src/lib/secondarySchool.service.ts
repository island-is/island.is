import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { SecondarySchoolProgram } from './graphql/models'
import { SecondarySchoolClient } from '@island.is/clients/secondary-school'

@Injectable()
export class SecondarySchoolApi {
  constructor(private readonly secondarySchoolClient: SecondarySchoolClient) {}

  async getProgramsBySchoolId(
    auth: User,
    schoolId: string,
    isFreshman: boolean,
  ): Promise<SecondarySchoolProgram[]> {
    return this.secondarySchoolClient.getPrograms(auth, schoolId, isFreshman)
  }
}
