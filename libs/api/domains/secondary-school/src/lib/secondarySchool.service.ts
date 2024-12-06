import { Injectable } from '@nestjs/common'
import { SecondarySchoolProgram } from './graphql/models'
import { SecondarySchoolClient } from '@island.is/clients/secondary-school'

@Injectable()
export class SecondarySchoolApi {
  constructor(private readonly secondarySchoolClient: SecondarySchoolClient) {}

  async getProgramsBySchoolId(
    schoolId: string,
  ): Promise<SecondarySchoolProgram[]> {
    return this.secondarySchoolClient.getPrograms(schoolId)
  }
}
