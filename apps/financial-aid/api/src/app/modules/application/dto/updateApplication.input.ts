import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import {
  UpdateApplication,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'

@InputType()
export class UpdateApplicationInput implements UpdateApplication {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field(() => String)
  readonly state!: ApplicationState

  @Allow()
  @Field({ nullable: true })
  readonly amount?: number

  @Allow()
  @Field({ nullable: true })
  readonly rejection?: string

  @Allow()
  @Field({ nullable: true })
  readonly staffId?: string
}
