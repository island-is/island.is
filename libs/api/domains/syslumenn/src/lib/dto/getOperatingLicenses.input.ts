import { IsNumber, IsString, IsOptional } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetOperatingLicensesInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  searchBy?: string

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  pageNumber?: number

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  pageSize?: number
}
