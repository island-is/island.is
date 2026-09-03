import { Field, InputType, Int } from '@nestjs/graphql'
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator'

@InputType('HmsGetRentalAgreementsInput')
export class GetRentalAgreementsInput {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  hideInactiveAgreements?: boolean

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number
}
