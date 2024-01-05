import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PracticalDrivingLessonsInput {
  @Field()
  bookId!: string

  @Field()
  id!: string
}
