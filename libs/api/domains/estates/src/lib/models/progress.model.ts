import { Field, ObjectType } from '@nestjs/graphql'
import { ProgressStep } from './progressStep.model'

@ObjectType('EstatesProgress')
export class Progress {
  @Field({ nullable: true })
  title?: string

  @Field(() => [ProgressStep], { nullable: true })
  steps?: ProgressStep[]
}
