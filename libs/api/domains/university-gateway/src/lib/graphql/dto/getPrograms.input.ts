import { DegreeType, Season } from '@island.is/university-gateway-types'
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

  @Field(() => Season, { nullable: true })
  season?: Season

  @Field()
  universityId?: string

  @Field(() => DegreeType, { nullable: true })
  degreeType?: DegreeType
}
