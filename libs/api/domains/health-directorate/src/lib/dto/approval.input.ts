import { InputType, Field } from '@nestjs/graphql'
import { IsISO8601, IsArray, IsString, ArrayNotEmpty } from 'class-validator'
import { ApprovalCodesEnum } from '../models/enums'

@InputType('HealthDirectoratePatientDataApprovalInput')
export class ApprovalInput {
  @Field()
  @IsISO8601()
  validFrom!: string

  @Field()
  @IsISO8601()
  validTo!: string

  @Field(() => [ApprovalCodesEnum])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  codes!: ApprovalCodesEnum[]

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  countryCodes!: string[]
}
