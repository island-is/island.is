import { Allow, IsOptional } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { EventType } from '@island.is/judicial-system/types'

@InputType()
export class CreateEventLogInput {
  @Allow()
  @Field(() => EventType)
  readonly eventType!: EventType

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly caseId?: string
}
