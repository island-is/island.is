import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateUserInput {
  @Allow()
  @Field(() => ID)
  readonly id!: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly name?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly title?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly mobileNumber?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly email?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly active?: boolean

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly canConfirmIndictment?: boolean
}
