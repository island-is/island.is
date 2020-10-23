import { Field, HideField, InputType } from '@nestjs/graphql'
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator'

@InputType()
export class TellUsAStoryInput {
  @Field()
  @IsString()
  organization: string

  @Field()
  @IsDateString()
  dateOfStory: string

  @Field()
  @IsOptional()
  @IsString()
  subject = 'N/A'

  @Field()
  @IsString()
  message: string

  @Field()
  @IsString()
  name: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsOptional()
  @IsBoolean()
  publicationAllowed = false

  @HideField()
  @IsString()
  type: 'tellUsAStory' = 'tellUsAStory'
}
