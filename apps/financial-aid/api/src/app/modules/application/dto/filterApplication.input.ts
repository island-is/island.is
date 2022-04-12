import { Allow } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'

@InputType()
export class FilterApplicationsInput {
  @Allow()
  @Field(() => [String])
  readonly states!: ApplicationState[]

  @Allow()
  @Field(() => [Number])
  readonly months!: number[]
}
