import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WebVerdictCaseCategory')
class CaseCategory {
  @Field()
  label!: string
}

@ObjectType('WebVerdictCaseCategoriesResponse')
export class CaseCategoriesResponse {
  @CacheField(() => [CaseCategory])
  caseCategories!: CaseCategory[]
}
