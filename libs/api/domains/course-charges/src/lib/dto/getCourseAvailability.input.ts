import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetCourseAvailabilityInput {
  @Field(() => String)
  courseId!: string
}
