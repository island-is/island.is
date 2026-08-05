import { Allow, IsOptional } from 'class-validator'

import { Field, InputType, Int } from '@nestjs/graphql'

import { MessageSuspensionCategory } from '@island.is/judicial-system/types'

@InputType()
export class UpdateMessageSuspensionInput {
  @Allow()
  @Field(() => MessageSuspensionCategory)
  readonly category!: MessageSuspensionCategory

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly suspended?: boolean

  @Allow()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  readonly delaySeconds?: number
}
