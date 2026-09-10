import { Field, Float, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString } from 'class-validator'

@InputType('PartTimeJobValidationInput')
export class PartTimeJobValidationInput {
  @Field()
  @IsString()
  validationId!: string

  @Field()
  @IsString()
  employerSSN!: string

  @Field()
  @IsString()
  periodFrom!: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  periodTo?: string

  @Field(() => Float)
  @IsNumber()
  ratio!: number

  @Field(() => Float)
  @IsNumber()
  estimatedIncome!: number
}
