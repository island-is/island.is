import { Field, InputType, Int } from '@nestjs/graphql'
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
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

  @Field(() => Int, { nullable: true, description: '1-100, defaults to 20.' })
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
  @IsString()
  @IsOptional()
  before?: string
}
