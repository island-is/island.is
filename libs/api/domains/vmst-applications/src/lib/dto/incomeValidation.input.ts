import { Field, Float, InputType } from '@nestjs/graphql'
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

// Fields other than id/deleted are optional so a delete marker ({ id, deleted:
// true }) is valid on the same array as create rows. The service branches on
// `deleted` when mapping to Galdur.
@InputType('TRPaymentValidationInput')
export class TRPaymentValidationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  validationId?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  incomeTypeId?: string

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  estimatedIncome?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  periodFrom?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  periodTo?: string | null
}

@InputType('IrregularJobValidationInput')
export class IrregularJobValidationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  validationId?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  employerSSN?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  periodFrom?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  periodTo?: string

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  estimatedIncome?: number

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workShiftPeriodIds?: string[]
}

@InputType('ContractorJobValidationInput')
export class ContractorJobValidationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  validationId?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  periodFrom?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  periodTo?: string
}

@InputType('CapitalIncomePaymentValidationInput')
export class CapitalIncomePaymentValidationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  validationId?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  incomeTypeId?: string

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  estimatedIncome?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  periodFrom?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  periodTo?: string | null
}

@InputType('PensionPaymentValidationInput')
export class PensionPaymentValidationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  validationId?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  incomeTypeId?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  pensionFundId?: string

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  estimatedIncome?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  periodFrom?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  periodTo?: string | null
}

@InputType('PartTimeJobValidationInput')
export class PartTimeJobValidationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  id?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  validationId?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  employerSSN?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  periodFrom?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  periodTo?: string

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  ratio?: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  estimatedIncome?: number
}

// Discriminated by which array is populated; the service branches per-type when
// mapping to the underlying Galdur validate/create request.
@InputType('IncomeValidationInput')
export class IncomeValidationInput {
  @Field(() => [IrregularJobValidationInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IrregularJobValidationInput)
  irregularJobs?: IrregularJobValidationInput[]

  @Field(() => [ContractorJobValidationInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractorJobValidationInput)
  contractorJobs?: ContractorJobValidationInput[]

  @Field(() => [CapitalIncomePaymentValidationInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CapitalIncomePaymentValidationInput)
  capitalIncomePayments?: CapitalIncomePaymentValidationInput[]

  @Field(() => [TRPaymentValidationInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TRPaymentValidationInput)
  trPayments?: TRPaymentValidationInput[]

  @Field(() => [PensionPaymentValidationInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PensionPaymentValidationInput)
  pensionPayments?: PensionPaymentValidationInput[]

  @Field(() => [PartTimeJobValidationInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartTimeJobValidationInput)
  partTimeJobs?: PartTimeJobValidationInput[]
}
