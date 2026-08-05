import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PoliceDefendant {
  @Field(() => String)
  readonly nationalId!: string

  @Field(() => String, { nullable: true })
  readonly name?: string

  @Field(() => String, { nullable: true })
  readonly gender?: string

  @Field(() => String, { nullable: true })
  readonly address?: string

  @Field(() => String, { nullable: true })
  readonly dateOfBirth?: string

  @Field(() => String, { nullable: true })
  readonly citizenship?: string
}
