import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator'

import { Field, ID, InputType, Int } from '@nestjs/graphql'

@InputType()
export class UpdateCourtDocumentInput {
  @Field(() => ID)
  @IsUUID()
  readonly caseId!: string

  @Field(() => ID)
  @IsUUID()
  readonly courtSessionId!: string

  @Field(() => ID)
  @IsUUID()
  readonly courtDocumentId!: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly documentOrder?: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly name?: string
}
