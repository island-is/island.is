import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DrivingAssessment {
  @Field()
  studentNationalId!: string
}
