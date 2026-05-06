import { Field, InputType } from '@nestjs/graphql'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator'

import { Environment } from '@island.is/shared/types'

@InputType('UpdateAuthAdminLanguageInput')
export class UpdateLanguageInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z]{2,5}$/, {
    message: 'isoKey must be 2-5 lowercase letters',
  })
  isoKey!: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  description!: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  englishDescription!: string

  @Field(() => [Environment], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(Environment, { each: true })
  environments?: Environment[]
}
