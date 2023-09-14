import { DegreeType, Season } from '@island.is/university-gateway-lib'
import { Field, InputType } from '@nestjs/graphql'

export
@InputType()
class GetProgramsInput {
  @Field({ nullable: true })
  limit?: number

  @Field({ nullable: true })
  before?: string

  @Field({ nullable: true })
  after?: string

  @Field({ nullable: true })
  active?: boolean

  @Field({ nullable: true })
  year?: number

  @Field(() => Season, { nullable: true })
  season?: Season

  @Field({ nullable: true })
  universityId?: string

  @Field(() => DegreeType, { nullable: true })
  degreeType?: DegreeType
}
