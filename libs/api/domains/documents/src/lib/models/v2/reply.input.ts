import { InputType, Field } from '@nestjs/graphql'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

@InputType('DocumentReplyInput')
export class ReplyInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly documentId!: string

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000, {
    message: 'Message body is too long (max 10000 characters)',
  })
  readonly body!: string

  @Field()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  readonly requesterEmail!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Subject is too long (max 200 characters)' })
  readonly subject?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Name is too long (max 100 characters)' })
  readonly requesterName?: string
}
