import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DrivingSchool {
  @Field()
  hasCompleted!: boolean
}
