import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import {
  CreateApplicationEvent,
  ApplicationState,
} from '@island.is/financial-aid/shared'

@InputType()
export class CreateApplicationEventInput implements CreateApplicationEvent {
  @Allow()
  @Field()
  readonly applicationId!: string

  @Allow()
  @Field({ nullable: true })
  readonly comment?: string

  @Allow()
  @Field(() => String)
  readonly state!: ApplicationState
}
