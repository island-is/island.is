import { Allow } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'

@InputType()
export class FilterApplicationsInput {
  @Allow()
  @Field(() => [String])
  readonly defaultStates!: ApplicationState[]

  @Allow()
  @Field(() => [String])
  readonly states!: ApplicationState[]

  @Allow()
  @Field(() => [Number])
  readonly months!: number[]

  @Allow()
  @Field(() => [String])
  readonly staff!: string[]

  @Allow()
  @Field()
  readonly page!: number

  @Allow()
  @Field({ nullable: true })
  readonly startDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly endDate?: string
}
