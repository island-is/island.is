import { Field, InputType, Int } from '@nestjs/graphql'
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'

import { Environment } from '@island.is/shared/types'

@InputType('CreateAuthAdminIdpProviderInput')
export class CreateIdpProviderInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name!: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  description!: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  helptext!: string

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(4)
  level!: number

  @Field(() => [Environment], { nullable: true })
  @IsOptional()
  environments?: Environment[]
}
