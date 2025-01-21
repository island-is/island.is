import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('WebVerdictCaseType')
class CaseType {
  @Field(() => Int)
  id!: number

  @Field()
  label!: string
}

@ObjectType('WebVerdictCaseTypesResponse')
export class CaseTypesResponse {
  @CacheField(() => [CaseType])
  caseTypes!: CaseType[]
}
