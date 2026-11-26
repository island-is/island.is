import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CaseLifetimeResponse {
  @Field(() => ID)
  readonly caseId!: string

  @Field(() => String, { nullable: true })
  readonly archiveNotBefore?: string

  @Field(() => Boolean)
  readonly caseRestored!: boolean
}
