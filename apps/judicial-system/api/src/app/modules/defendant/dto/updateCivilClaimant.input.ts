import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateCivilClaimantInput {
  @Allow()
  @Field(() => ID)
  readonly civilClaimantId!: string

  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly noNationalId?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly name?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly hasSpokesperson?: boolean

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly spokespersonIsLawyer?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly spokespersonNationalId?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly spokespersonName?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly spokespersonEmail?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly spokespersonPhoneNumber?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly caseFilesSharedWithSpokesperson?: boolean

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly isSpokespersonConfirmed?: boolean
}
