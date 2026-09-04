import { Order } from '@island.is/nest/pagination'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsBoolean, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'

@InputType('HmsRentalAgreementsInput')
export class RentalAgreementsInput {
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

  @Field(() => Order, { nullable: true, defaultValue: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  sort?: Order
}
