import { Allow, IsInt, IsOptional } from 'class-validator'

import { Field, ID, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreatePoliceDigitalCaseFileInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => String)
  readonly policeCaseNumber!: string

  @Allow()
  @Field(() => String)
  readonly policeDigitalFileId!: string

  @Allow()
  @Field(() => String)
  readonly policeExternalVendorId!: string

  @Allow()
  @Field(() => String)
  readonly name!: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly displayDate?: string

  @Allow()
  @IsOptional()
  @IsInt()
  @Field(() => Int, { nullable: true })
  readonly orderWithinChapter?: number
}
