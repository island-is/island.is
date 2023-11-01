import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('FinanceChargeTypePeriodSubjectInput')
export class GetChargeTypePeriodSubjectInput {
  @Field()
  @IsString()
  year!: string

  @Field()
  @IsString()
  typeId!: string

  @Field()
  @IsString()
  subject!: string

  @Field()
  @IsString()
  period!: string
}
