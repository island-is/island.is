import { Field, InputType } from '@nestjs/graphql'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

import { Environment } from '@island.is/shared/types'

@InputType('DeleteAuthAdminTranslationInput')
export class DeleteTranslationInput {
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

  @Field(() => [Environment], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(Environment, { each: true })
  environments?: Environment[]
}
