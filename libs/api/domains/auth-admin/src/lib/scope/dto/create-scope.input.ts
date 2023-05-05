import { IsNotEmpty, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

import { Environment } from '@island.is/shared/types'

@InputType()
export class CreateScopeInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  tenantId!: string

  @Field(() => [Environment], { nullable: false })
  environments!: Environment[]

  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  name!: string

  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  displayName!: string

  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  description!: string
}
