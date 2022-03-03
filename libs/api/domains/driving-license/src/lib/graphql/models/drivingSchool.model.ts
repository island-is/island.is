import { Field, ID,ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DrivingSchool {
  @Field()
  hasCompleted!: boolean
}
