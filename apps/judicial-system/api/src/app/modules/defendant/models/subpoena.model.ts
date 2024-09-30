import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Subpoena {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  created?: string

  @Field(() => String, { nullable: true })
  modified?: string

  @Field(() => String, { nullable: true })
  subpoenaId?: string

  @Field(() => Boolean, { nullable: true })
  acknowledged?: boolean

  @Field(() => String, { nullable: true })
  registeredBy?: string

  @Field(() => String, { nullable: true })
  comment?: string

  @Field(() => String, { nullable: true })
  arraignmentDate?: string

  @Field(() => String, { nullable: true })
  location?: string
}
