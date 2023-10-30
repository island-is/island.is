import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AssessmentYearsData {
  @Field(() => [String])
  year!: string[]
}

@ObjectType()
export class AssessmentYearsModel {
  @Field(() => [String], { nullable: true })
  year?: string[]
}
