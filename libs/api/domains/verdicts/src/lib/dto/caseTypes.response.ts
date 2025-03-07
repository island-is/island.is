import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WebVerdictCaseType')
class CaseType {
  @Field()
  label!: string
}

@ObjectType('WebVerdictCaseTypesResponse')
export class CaseTypesResponse {
  @CacheField(() => [CaseType])
  caseTypes!: CaseType[]
}
