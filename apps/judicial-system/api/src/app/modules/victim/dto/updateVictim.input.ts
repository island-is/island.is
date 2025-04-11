import { Allow, IsOptional } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import { RequestSharedWhen } from '@island.is/judicial-system/types'

@InputType()
export class UpdateVictimInput {
  @Allow()
  @Field(() => ID)
  readonly victimId!: string

  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly name?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly hasNationalId?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Allow()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  readonly hasLawyer?: boolean

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly lawyerNationalId?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly lawyerName?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly lawyerEmail?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly lawyerPhoneNumber?: string

  @Allow()
  @IsOptional()
  @Field(() => RequestSharedWhen, { nullable: true })
  readonly lawyerAccessToRequest?: RequestSharedWhen
}
