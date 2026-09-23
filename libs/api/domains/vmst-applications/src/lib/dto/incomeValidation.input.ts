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
@InputType('VmstApplicationsTRPaymentValidationInput')
export class VmstApplicationsTRPaymentValidationInput {
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

@InputType('VmstApplicationsIrregularJobValidationInput')
export class VmstApplicationsIrregularJobValidationInput {
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

@InputType('VmstApplicationsContractorJobValidationInput')
export class VmstApplicationsContractorJobValidationInput {
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

@InputType('VmstApplicationsCapitalIncomePaymentValidationInput')
export class VmstApplicationsCapitalIncomePaymentValidationInput {
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

@InputType('VmstApplicationsPensionPaymentValidationInput')
export class VmstApplicationsPensionPaymentValidationInput {
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

@InputType('VmstApplicationsPartTimeJobValidationInput')
export class VmstApplicationsPartTimeJobValidationInput {
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
@InputType('VmstApplicationsIncomeValidationInput')
export class VmstApplicationsIncomeValidationInput {
  @Field(() => [VmstApplicationsIrregularJobValidationInput], {
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VmstApplicationsIrregularJobValidationInput)
  irregularJobs?: VmstApplicationsIrregularJobValidationInput[]

  @Field(() => [VmstApplicationsContractorJobValidationInput], {
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VmstApplicationsContractorJobValidationInput)
  contractorJobs?: VmstApplicationsContractorJobValidationInput[]

  @Field(() => [VmstApplicationsCapitalIncomePaymentValidationInput], {
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VmstApplicationsCapitalIncomePaymentValidationInput)
  capitalIncomePayments?: VmstApplicationsCapitalIncomePaymentValidationInput[]

  @Field(() => [VmstApplicationsTRPaymentValidationInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VmstApplicationsTRPaymentValidationInput)
  trPayments?: VmstApplicationsTRPaymentValidationInput[]

  @Field(() => [VmstApplicationsPensionPaymentValidationInput], {
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VmstApplicationsPensionPaymentValidationInput)
  pensionPayments?: VmstApplicationsPensionPaymentValidationInput[]

  @Field(() => [VmstApplicationsPartTimeJobValidationInput], {
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VmstApplicationsPartTimeJobValidationInput)
  partTimeJobs?: VmstApplicationsPartTimeJobValidationInput[]
}
