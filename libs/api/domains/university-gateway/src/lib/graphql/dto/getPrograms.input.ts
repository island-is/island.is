import {
  ProgramControllerGetProgramsDegreeTypeEnum,
  ProgramControllerGetProgramsSeasonEnum,
} from '@island.is/clients/university-gateway-api'
import { Field, InputType } from '@nestjs/graphql'

export
@InputType()
class GetProgramsInput {
  @Field()
  limit?: number

  @Field()
  before?: string

  @Field()
  after?: string

  @Field()
  active?: boolean

  @Field()
  year?: number

  @Field(() => ProgramControllerGetProgramsSeasonEnum, { nullable: true })
  season?: ProgramControllerGetProgramsSeasonEnum

  @Field()
  universityId?: string

  @Field(() => ProgramControllerGetProgramsDegreeTypeEnum, { nullable: true })
  degreeType?: ProgramControllerGetProgramsDegreeTypeEnum
}
