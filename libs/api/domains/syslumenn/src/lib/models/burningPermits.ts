import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class BurningPermit {
  @Field(() => Date, { nullable: true })
  date?: Date | null

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => String, { nullable: true })
  subtype?: string | null

  @Field(() => String, { nullable: true })
  responsibleParty?: string | null

  @Field(() => String, { nullable: true })
  office?: string | null

  @Field(() => String, { nullable: true })
  licensee?: string | null

  @Field(() => String, { nullable: true })
  place?: string | null
}

@ObjectType()
export class BurningPermitsResponse {
  @CacheField(() => [BurningPermit])
  list!: BurningPermit[]
}
