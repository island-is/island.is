import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeletePracticalDrivingLessonInput {
  @Field()
  id!: string

  @Field()
  bookId!: string

  @Field()
  reason?: string
}
