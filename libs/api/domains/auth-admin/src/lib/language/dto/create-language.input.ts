import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { Environment } from '@island.is/shared/types'

@InputType('CreateAuthAdminLanguageInput')
export class CreateLanguageInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
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
  environments?: Environment[]
}
