import { Field, ObjectType } from '@nestjs/graphql'

import { Aid, AidType } from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class AidModel implements Aid {
  @Field()
  readonly ownPlace!: number

  @Field()
  readonly registeredRenting!: number

  @Field()
  readonly unregisteredRenting!: number

  @Field()
  readonly livesWithParents!: number

  @Field()
  readonly unknown!: number

  @Field()
  readonly municipalityId!: string

  @Field(() => String)
  readonly type!: AidType
}
