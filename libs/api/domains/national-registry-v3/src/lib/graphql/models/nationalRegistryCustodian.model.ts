import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType('NationalRegistryV3Custodian')
export class Custodian {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  custodyCode?: string

  @Field(() => String, { nullable: true })
  custodyText?: string

  @Field({ nullable: true })
  livesWithChild?: boolean
}
