import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsOptional, IsString } from 'class-validator'

@InputType('WorkMachineExamineeInput')
export class WorkMachineExamineeInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  nationalId?: string | null

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  email?: string | null

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber?: string | null

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  drivingLicenseNumber?: string | null

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  drivingLicenseCountryOfOrigin?: string | null

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  examCategories?: string[] | null
}

@InputType('ExamineeValidationInput')
export class ExamineeValidationInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  xCorrelationID?: string

  @Field(() => WorkMachineExamineeInput, { nullable: true })
  @IsOptional()
  workMachineExamineeDto?: WorkMachineExamineeInput
}
