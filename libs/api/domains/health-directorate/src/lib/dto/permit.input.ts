import { InputType, Field } from '@nestjs/graphql'
import { IsISO8601, IsArray, IsString, ArrayNotEmpty } from 'class-validator'
import { PermitCodesEnum } from '../models/enums'

@InputType('HealthDirectoratePatientDataPermitInput')
export class PermitInput {
  @Field()
  @IsISO8601()
  validFrom!: string

  @Field()
  @IsISO8601()
  validTo!: string

  @Field(() => [PermitCodesEnum])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  codes!: PermitCodesEnum[]

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  countryCodes!: string[]
}

@InputType('HealthDirectoratePatientDataInvalidatePermitInput')
export class InvalidatePermitInput {
  @Field()
  @IsString()
  id!: string
}
