import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class ProfessionRight {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  profession?: string
}

@ObjectType()
export class ProfessionRightsResponse {
  @CacheField(() => [ProfessionRight])
  list!: ProfessionRight[]
}
