import { Allow, IsOptional } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateServiceInterruptionBannerInput {
  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly title?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly globalMessage?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly prosecutorMessage?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly courtMessage?: string
}
