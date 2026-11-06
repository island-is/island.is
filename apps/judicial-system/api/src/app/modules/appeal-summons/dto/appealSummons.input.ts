import { Type } from 'class-transformer'
import {
  Allow,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

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

@InputType()
export class AppealSummonsDefendantInput {
  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly defendantId!: string

  @Allow()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  readonly claims!: string
}

@InputType()
export class CreateAppealSummonsInput {
  @Allow()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AppealSummonsDefendantInput)
  @Field(() => [AppealSummonsDefendantInput])
  readonly defendants!: AppealSummonsDefendantInput[]
}

@InputType()
export class UpdateAppealSummonsInput {
  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly appealSummonsId!: string

  @Allow()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AppealSummonsDefendantInput)
  @Field(() => [AppealSummonsDefendantInput])
  readonly defendants!: AppealSummonsDefendantInput[]
}

@InputType()
export class DeleteAppealSummonsInput {
  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly appealSummonsId!: string
}

@InputType()
export class ConfirmAppealSummonsInput {
  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly appealSummonsId!: string
}

@InputType()
export class SendAppealSummonsToCourtOfAppealsInput {
  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly appealSummonsId!: string
}

@InputType()
export class AppealSummonsServiceRecipientInput {
  // @IsOptional() would skip the XOR constraint when defendantId is absent.
  @Allow()
  @Validate(ExactlyOneAppealSummonsServiceRecipientConstraint)
  @ValidateIf(
    (recipient: AppealSummonsServiceRecipientInput) =>
      (recipient.defendantId !== null && recipient.defendantId !== undefined) ||
      recipient.civilClaimantId === null ||
      recipient.civilClaimantId === undefined,
  )
  @IsUUID()
  @Field(() => ID, { nullable: true })
  readonly defendantId?: string

  @Allow()
  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  readonly civilClaimantId?: string
}

@InputType()
export class SendAppealSummonsToServiceInput {
  @Allow()
  @IsUUID()
  @Field(() => ID)
  readonly appealSummonsId!: string

  @Allow()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AppealSummonsServiceRecipientInput)
  @Field(() => [AppealSummonsServiceRecipientInput])
  readonly recipients!: AppealSummonsServiceRecipientInput[]
}
