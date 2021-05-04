import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NewDrivingAssessmentResult {
  @Field()
  success!: boolean
}
