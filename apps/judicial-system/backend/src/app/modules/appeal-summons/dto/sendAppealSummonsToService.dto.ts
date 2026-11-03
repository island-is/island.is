import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsUUID,
  Validate,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

@ValidatorConstraint({
  name: 'exactlyOneAppealSummonsServiceRecipient',
  async: false,
})
class ExactlyOneAppealSummonsServiceRecipientConstraint
  implements ValidatorConstraintInterface
{
  validate(_: unknown, args: ValidationArguments): boolean {
    const object = args.object as {
      defendantId?: string
      civilClaimantId?: string
    }

    return Boolean(object.defendantId) !== Boolean(object.civilClaimantId)
  }

  defaultMessage(): string {
    return 'Exactly one of defendantId and civilClaimantId must be set'
  }
}

export class AppealSummonsServiceRecipientDto {
  // @IsOptional() would skip the XOR constraint when defendantId is absent.
  @Validate(ExactlyOneAppealSummonsServiceRecipientConstraint)
  @ValidateIf(
    (recipient: AppealSummonsServiceRecipientDto) =>
      (recipient.defendantId !== null &&
        recipient.defendantId !== undefined) ||
      recipient.civilClaimantId === null ||
      recipient.civilClaimantId === undefined,
  )
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly defendantId?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly civilClaimantId?: string
}

export class SendAppealSummonsToServiceDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AppealSummonsServiceRecipientDto)
  @ApiProperty({ type: AppealSummonsServiceRecipientDto, isArray: true })
  readonly recipients!: AppealSummonsServiceRecipientDto[]
}
