import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetChargeItemCodesByCourseIdInput {
  @Field(() => String)
  courseId!: string
}
