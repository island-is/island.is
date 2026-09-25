import { Field, ID, InputType, Int } from '@nestjs/graphql'
import {
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator'
import { HealthConversationStatusFilterEnum } from '../models/enums'

@InputType()
export class HealthDirectoratePaginatedHealthConversationsInput {
  @Field(() => HealthConversationStatusFilterEnum, { nullable: true })
  @IsEnum(HealthConversationStatusFilterEnum)
  @IsOptional()
  status?: HealthConversationStatusFilterEnum

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  starred?: boolean

  @Field({
    nullable: true,
    description: 'Matches the conversation title or its group name.',
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  search?: string

  @Field(() => ID, { nullable: true })
  @IsString()
  @MaxLength(255)
  @Matches(/[^.]/)
  @IsOptional()
  treatmentId?: string

  @Field(() => Int, {
    nullable: true,
    defaultValue: 20,
    description: '1-100.',
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number

  @Field({ nullable: true, description: 'Not combinable with before.' })
  @IsString()
  @IsOptional()
  after?: string

  @Field({ nullable: true, description: 'Not combinable with after.' })
  @ValidateIf((input) => input.after != null && input.after !== '')
  @IsEmpty({ message: 'before cannot be combined with after' })
  @IsOptional()
  before?: string
}
