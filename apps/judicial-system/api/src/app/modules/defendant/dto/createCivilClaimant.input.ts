import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CreateCivilClaimantInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

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
  readonly isLawyer?: boolean
}
