import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional,IsString } from 'class-validator'

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
