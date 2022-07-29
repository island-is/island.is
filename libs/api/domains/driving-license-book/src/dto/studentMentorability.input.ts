import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class StudentMentorabilityInput {
  @Field()
  nationalId!: string
}
