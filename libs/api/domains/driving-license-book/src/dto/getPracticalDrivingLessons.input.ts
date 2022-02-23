import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PracticalDrivingLessonsInput {
  @Field({ nullable: true })
  bookId!: string

  @Field({ nullable: true })
  id?: string
}
