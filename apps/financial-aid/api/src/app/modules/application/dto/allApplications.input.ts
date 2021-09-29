import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'
import { ApplicationStateUrl } from '@island.is/financial-aid/shared/lib'

@InputType()
export class AllApplicationInput {
  @Allow()
  @Field(() => String)
  readonly stateUrl!: ApplicationStateUrl
}
