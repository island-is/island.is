import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'

import { UpdateDefendantDto } from './updateDefendant.dto'

// The case is read once for the whole batch, so every defendant's update is
// decided against the case as it was before the first one was written. Only
// fields whose update is safe against that belong here: either it reads
// nothing another defendant's update could change, or, like the review
// decision filing and withdrawing the verdict appeal, it reads what it depends
// on again under the case lock.
export class UpdateDefendantsItemDto extends PickType(UpdateDefendantDto, [
  'subpoenaType',
  'isAlternativeService',
  'alternativeServiceDescription',
  'isDrivingLicenseSuspended',
  'indictmentReviewDecision',
] as const) {
  @IsUUID()
  @ApiProperty({ type: String })
  readonly defendantId!: string
}

export class UpdateDefendantsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateDefendantsItemDto)
  @ApiProperty({ type: UpdateDefendantsItemDto, isArray: true })
  readonly defendants!: UpdateDefendantsItemDto[]

  // Whether changed review decisions should also file or withdraw the
  // prosecution's verdict appeal, as on the single defendant route. Set by the
  // API, which reads the INDICTMENT_APPEAL feature; never a defendant field.
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly registerVerdictAppeal?: boolean
}
