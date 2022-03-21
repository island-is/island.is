import { IsString, IsBoolean, IsOptional } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ValidateMortgageCertificateInput {
  @Field()
  @IsString()
  propertyNumber!: string

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isFromSearch?: boolean
}
