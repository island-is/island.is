import { PaginationInput } from '@island.is/nest/pagination';
import { Field, InputType } from '@nestjs/graphql'
import { IsISO8601, IsOptional, IsString } from 'class-validator'

@InputType('IcelandicGovernmentInstitutionsInvoiceListInput')
export class InvoiceListInput extends PaginationInput() {
  @Field({nullable: true})
  @IsISO8601()
  @IsOptional()
  dateFrom?: Date;

  @Field({nullable: true})
  @IsISO8601()
  @IsOptional()
  dateTo?: Date;

  @Field({nullable: true})
  @IsString()
  @IsOptional()
  type?: string;


  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  @IsOptional()
  sellers?: string[];

  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  @IsOptional()
  buyers?: string[];
}
