import { CacheField } from '@island.is/nest/graphql'
import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType()
class BurningPermit {
  @Field(() => Date, { nullable: true })
  dateFrom?: Date | null

  @Field(() => String, { nullable: true })
  timeFrom?: string | null

  @Field(() => Date, { nullable: true })
  dateTo?: Date | null

  @Field(() => String, { nullable: true })
  timeTo?: string | null

  @Field(() => Float, { nullable: true })
  size?: number | null

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
