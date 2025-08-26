import { Field, InputType, ID } from '@nestjs/graphql'

@InputType('OJOIAIdInput', {
  description: 'Input dto that represents the id of the application',
})
export class OJOIAIdInput {
  @Field(() => ID)
  id!: string

  @Field(() => Boolean, { defaultValue: true })
  showDate?: boolean
}
