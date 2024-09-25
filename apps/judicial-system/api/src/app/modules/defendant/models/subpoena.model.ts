import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Subpoena {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => ID, { nullable: true })
  readonly subpoenaId!: string

  @Field(() => ID, { nullable: true })
  readonly defendantId?: string

  @Field(() => ID, { nullable: true })
  readonly caseId?: string

  @Field(() => Boolean, { nullable: true })
  readonly acknowledged?: boolean

  @Field(() => String, { nullable: true })
  readonly acknowledgedDate?: string

  @Field(() => String, { nullable: true })
  readonly registeredBy?: string

  @Field(() => String, { nullable: true })
  readonly comment?: string
}
