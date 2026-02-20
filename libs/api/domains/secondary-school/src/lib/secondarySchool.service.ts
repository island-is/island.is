import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import {
  SecondarySchoolProgram,
  SecondarySchoolProgrammeSimple,
  SecondarySchoolProgrammeFilterOptions,
  SecondarySchoolProgrammeDetail,
} from './graphql/models'
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

  async getAllProgrammes(): Promise<SecondarySchoolProgrammeSimple[]> {
    return this.secondarySchoolClient.getAllProgrammes()
  }

  async getProgrammeFilterOptions(): Promise<SecondarySchoolProgrammeFilterOptions> {
    return this.secondarySchoolClient.getFilterOptions()
  }

  async getProgrammeById(id: string): Promise<SecondarySchoolProgrammeDetail> {
    return this.secondarySchoolClient.getProgrammeById(id)
  }
}
