import { Field, ObjectType, ID } from '@nestjs/graphql'

import { ApplicationChildren } from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class ChildrenModel implements ApplicationChildren {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field()
  readonly applicationId!: string

  @Field({ nullable: true })
  readonly school?: string

  @Field()
  readonly nationalId!: string

  @Field()
  readonly name!: string

  @Field()
  readonly livesWithApplicant!: boolean

  @Field()
  readonly livesWithBothParents!: boolean
}
