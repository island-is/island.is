import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsNotEmpty, MaxLength } from 'class-validator'

@InputType('FormSystemGoogleTranslationInput')
export class GoogleTranslationInput {
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2500)
  q!: string
}
