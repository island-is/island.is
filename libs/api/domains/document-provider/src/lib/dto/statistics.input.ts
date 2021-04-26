import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class StatisticsInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  organisationId?: string

  @Field(() => String, {
    nullable: true,
    description: 'Date format: YYYY-MM-DD',
  })
  @IsString()
  @IsOptional()
  fromDate?: string

  @Field(() => String, {
    nullable: true,
    description: 'Date format: YYYY-MM-DD',
  })
  @IsString()
  @IsOptional()
  toDate?: string
}
