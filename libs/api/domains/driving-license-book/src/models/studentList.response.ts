import { Field, ObjectType } from '@nestjs/graphql'
import { StudentResponse } from './student.response'

@ObjectType()
export class StudentListResponse {
  @Field(() => [StudentResponse], { nullable: true })
  data?: StudentResponse[]

  @Field({ nullable: true })
  nextCursor?: string
}
