import { Field, HideField, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class ContactUsInput {
  @Field()
  @IsString()
  name: string

  @Field()
  @IsOptional()
  @IsString()
  phone?: string = 'N/A'

  @Field()
  @IsString()
  email: string

  @Field()
  @IsOptional()
  @IsString()
  subject?: string = 'N/A'

  @Field()
  @IsString()
  message: string

  @HideField()
  @IsString()
  type: 'contactUs' = 'contactUs'
}
