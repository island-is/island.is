import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class DrivingAssessment {
  @Field()
  studentNationalId!: string
}
