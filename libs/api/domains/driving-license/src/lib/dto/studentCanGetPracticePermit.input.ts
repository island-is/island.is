import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class StudentCanGetPracticePermitInput {
  @Field(() => String)
  studentSSN!: string
}
