import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CreateCivilClaimantInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly defendantId!: string

  @Allow()
  @Field(() => String)
  readonly name!: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderName?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderEmail?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly defenderPhoneNumber?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly caseFilesSharedWithDefender?: boolean
}
