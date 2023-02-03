import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CaseResult {
  @Field(() => Number)
  id?: number

  @Field(() => String)
  caseNumber?: string | null

  @Field(() => String)
  name?: string | null

  @Field(() => String)
  shortDescription?: string | null
}
