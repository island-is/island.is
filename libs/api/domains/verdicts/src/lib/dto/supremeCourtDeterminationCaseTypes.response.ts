import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WebSupremeCourtDeterminationCaseType')
class CaseType {
  @Field(() => String)
  label!: string
}

@ObjectType('WebSupremeCourtDeterminationCaseTypesResponse')
export class SupremeCourtDeterminationCaseTypesResponse {
  @CacheField(() => [CaseType])
  caseTypes!: CaseType[]
}
