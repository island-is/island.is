import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType('AuthAdminTranslationKeyInput')
export class TranslationKeyInput {
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
}
