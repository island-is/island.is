import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class BurningPermit {
  @Field(() => Date, { nullable: true })
  date: Date | null | undefined

  @Field({ nullable: true })
  type: string | null | undefined

  @Field({ nullable: true })
  subtype: string | null | undefined

  @Field({ nullable: true })
  responsibleParty: string | null | undefined

  @Field({ nullable: true })
  office: string | null | undefined

  @Field({ nullable: true })
  licensee: string | null | undefined

  @Field({ nullable: true })
  place: string | null | undefined
}

@ObjectType()
export class BurningPermitsResponse {
  @CacheField(() => [BurningPermit])
  list!: BurningPermit[]
}
