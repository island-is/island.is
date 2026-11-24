import { Field, InputType } from '@nestjs/graphql'
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

import { DirectorateOfEqualityApiKeyType } from '../models/enums'

@InputType('DirectorateOfEqualityIssueApiKeyInput')
export class IssueApiKeyInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string

  @Field(() => Date, { nullable: true, description: 'Omit for no expiry' })
  @IsOptional()
  @IsDate()
  expiresAt?: Date

  @Field(() => DirectorateOfEqualityApiKeyType)
  @IsEnum(DirectorateOfEqualityApiKeyType)
  type!: DirectorateOfEqualityApiKeyType
}
