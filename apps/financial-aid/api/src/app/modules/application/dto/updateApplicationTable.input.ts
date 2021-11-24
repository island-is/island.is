import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import {
  UpdateApplicationTable,
  ApplicationState,
  ApplicationStateUrl,
  ApplicationEventType,
} from '@island.is/financial-aid/shared/lib'

@InputType()
export class UpdateApplicationInputTable implements UpdateApplicationTable {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field(() => String)
  readonly state!: ApplicationState

  @Allow()
  @Field(() => String)
  readonly event!: ApplicationEventType

  @Allow()
  @Field()
  readonly staffId!: string

  @Allow()
  @Field(() => String)
  readonly stateUrl!: ApplicationStateUrl
}
