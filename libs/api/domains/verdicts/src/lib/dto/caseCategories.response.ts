import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('WebVerdictCaseCategory')
class CaseCategory {
  @Field(() => Int)
  id!: number

  @Field()
  label!: string
}

@ObjectType('WebVerdictCaseCategoriesResponse')
export class CaseCategoriesResponse {
  @CacheField(() => [CaseCategory])
  caseCategories!: CaseCategory[]
}
