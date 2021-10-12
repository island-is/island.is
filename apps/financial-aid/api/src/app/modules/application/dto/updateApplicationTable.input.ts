import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import {
  UpdateApplicationTable,
  ApplicationState,
  ApplicationStateUrl,
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
  @Field()
  readonly staffId!: string

  @Allow()
  @Field(() => String)
  readonly stateUrl!: ApplicationStateUrl
}
