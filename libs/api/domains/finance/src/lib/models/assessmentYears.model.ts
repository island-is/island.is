import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FinanceAssessmentYearsData')
export class AssessmentYearsData {
  @Field(() => [String])
  year!: string[]
}

@ObjectType('FinanceAssessmentYearsModel')
export class AssessmentYearsModel {
  @Field(() => [String], { nullable: true })
  year?: string[]
}
