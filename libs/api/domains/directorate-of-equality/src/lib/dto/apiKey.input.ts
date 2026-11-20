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
  label?: string | null

  @Field(() => Date, { nullable: true, description: 'Omit for no expiry' })
  @IsOptional()
  @IsDate()
  expiresAt?: Date | null

  @Field(() => DirectorateOfEqualityApiKeyType)
  @IsEnum(DirectorateOfEqualityApiKeyType)
  type!: DirectorateOfEqualityApiKeyType
}

@InputType('DirectorateOfEqualityRevokeApiKeyInput')
export class RevokeApiKeyInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => DirectorateOfEqualityApiKeyType)
  @IsEnum(DirectorateOfEqualityApiKeyType)
  type!: DirectorateOfEqualityApiKeyType
}
