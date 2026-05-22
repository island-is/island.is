import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import {
  SecondarySchoolProgram,
  SecondarySchoolProgrammeSimple,
  SecondarySchoolProgrammeFilterOptions,
  SecondarySchoolProgrammeDetail,
  SecondarySchoolIsReferenceProgramme,
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
    const programmes = await this.secondarySchoolPublicClient.getAllProgrammes()
    return programmes.map(({ id, ...rest }) => ({ ...rest, programmeId: id }))
  }

  async getProgrammeFilterOptions(): Promise<SecondarySchoolProgrammeFilterOptions> {
    const options = await this.secondarySchoolPublicClient.getFilterOptions()

    const mapIsReferenceProgramme = (
      value: string,
    ): SecondarySchoolIsReferenceProgramme | null => {
      if (value === 'Já') return SecondarySchoolIsReferenceProgramme.YES
      if (value === 'Nei') return SecondarySchoolIsReferenceProgramme.NO
      return null
    }

    return {
      ...options,
      isReferenceProgrammeFilterOption:
        options.isReferenceProgrammeFilterOption
          ?.map(mapIsReferenceProgramme)
          .filter(
            (v): v is SecondarySchoolIsReferenceProgramme => v !== null,
          ) ?? null,
    }
  }

  async getProgrammeById(id: string): Promise<SecondarySchoolProgrammeDetail> {
    return this.secondarySchoolPublicClient.getProgrammeById(id)
  }
}
