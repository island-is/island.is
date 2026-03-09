import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import {
  SecondarySchoolProgram,
  SecondarySchoolProgrammeSimple,
  SecondarySchoolProgrammeFilterOptions,
  SecondarySchoolProgrammeDetail,
} from './graphql/models'
import {
  SecondarySchoolClient,
  SecondarySchoolPublicClient,
} from '@island.is/clients/secondary-school'

@Injectable()
export class SecondarySchoolApi {
  constructor(
    private readonly secondarySchoolClient: SecondarySchoolClient,
    private readonly secondarySchoolPublicClient: SecondarySchoolPublicClient,
  ) {}

  async getProgramsBySchoolId(
    auth: User,
    schoolId: string,
    isFreshman: boolean,
  ): Promise<SecondarySchoolProgram[]> {
    return this.secondarySchoolClient.getPrograms(auth, schoolId, isFreshman)
  }

  async getAllProgrammes(): Promise<SecondarySchoolProgrammeSimple[]> {
    return this.secondarySchoolPublicClient.getAllProgrammes()
  }

  async getProgrammeFilterOptions(): Promise<SecondarySchoolProgrammeFilterOptions> {
    return this.secondarySchoolPublicClient.getFilterOptions()
  }

  async getProgrammeById(id: string): Promise<SecondarySchoolProgrammeDetail> {
    return this.secondarySchoolPublicClient.getProgrammeById(id)
  }
}
