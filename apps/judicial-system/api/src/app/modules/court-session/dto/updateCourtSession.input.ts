import { Type } from 'class-transformer'
import {
  Allow,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import {
  CourtSessionClosedLegalBasis,
  CourtSessionRulingType,
} from '@island.is/judicial-system/types'

@InputType()
export class UpdateCourtSessionInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly courtSessionId!: string

  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly location?: string

  @Allow()
  @IsOptional()
  @IsUUID()
  @Field(() => String, { nullable: true })
  readonly judgeId?: string

  @Allow()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Field(() => Date, { nullable: true })
  readonly startDate?: Date

  @Allow()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Field(() => Date, { nullable: true })
  readonly endDate?: Date

  @Allow()
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  readonly isClosed?: boolean

  @Allow()
  @IsOptional()
  @IsArray()
  @IsEnum(CourtSessionClosedLegalBasis, { each: true })
  @Field(() => [CourtSessionClosedLegalBasis], { nullable: true })
  readonly closedLegalProvisions?: CourtSessionClosedLegalBasis[]

  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly attendees?: string

  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly entries?: string

  @Allow()
  @IsOptional()
  @IsEnum(CourtSessionRulingType)
  @Field(() => CourtSessionRulingType, { nullable: true })
  readonly rulingType?: CourtSessionRulingType

  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly ruling?: string

  @Allow()
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  readonly isAttestingWitness?: boolean

  @Allow()
  @IsOptional()
  @IsUUID()
  @Field(() => String, { nullable: true })
  readonly attestingWitnessId?: string

  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly closingEntries?: string

  @Allow()
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  readonly isConfirmed?: boolean
}
