import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional } from 'class-validator'

@InputType()
export class GetPaymentFlowInput {
  @Field((_) => String)
  id!: string

  @Field((_) => Boolean, { nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  includeEvents?: boolean = false
}
