import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { Environment } from '@island.is/shared/types'

@InputType('CreateAuthAdminTranslationInput')
export class CreateTranslationInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  language!: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  className!: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  property!: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  key!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  value?: string

  @Field(() => [Environment], { nullable: true })
  @IsOptional()
  environments?: Environment[]
}
