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
    const programmes = await this.secondarySchoolPublicClient.getAllProgrammes()
    return programmes.map(({ id, ...rest }) => ({ ...rest, programmeId: id }))
  }

  async getProgrammeFilterOptions(): Promise<SecondarySchoolProgrammeFilterOptions> {
    return this.secondarySchoolPublicClient.getFilterOptions()
  }

  async getProgrammeById(id: string): Promise<SecondarySchoolProgrammeDetail> {
    const programme = await this.secondarySchoolPublicClient.getProgrammeById(
      id,
    )

    const mapSubjects = (subjects?: { id?: string | null }[] | null) =>
      subjects?.map(({ id: subjectId, ...rest }) => ({
        ...rest,
        subjectId,
      }))

    return {
      ...programme,
      programmeStructure: programme.programmeStructure
        ? {
            coreSubjectGroups:
              programme.programmeStructure.coreSubjectGroups?.map((g) => ({
                ...g,
                subjects: mapSubjects(g.subjects),
              })),
            packageChoices: programme.programmeStructure.packageChoices?.map(
              (c) => ({
                ...c,
                packages: c.packages?.map((p) => ({
                  ...p,
                  subjects: mapSubjects(p.subjects),
                })),
              }),
            ),
            subjectChoiceGroups:
              programme.programmeStructure.subjectChoiceGroups?.map((g) => ({
                ...g,
                subjects: mapSubjects(g.subjects),
              })),
          }
        : undefined,
    }
  }
}
