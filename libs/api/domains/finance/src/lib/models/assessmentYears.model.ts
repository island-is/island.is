import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinanceAssessmentYears')
export class AssessmentYears {
  @Field(() => [String], { nullable: true })
  year?: string[]
}
