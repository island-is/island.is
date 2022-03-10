import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class DrivingSchool {
  @Field()
  hasCompleted!: boolean
}
