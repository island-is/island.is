import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('EstatesStepStatus')
export class StepStatus {
  @Field({ nullable: true, description: 'Step status code from the API' })
  code?: string

  @Field({ nullable: true })
  text?: string
}
