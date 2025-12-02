import { Field, InputType } from '@nestjs/graphql'
import { ArrayNotEmpty, IsArray, IsISO8601, IsString } from 'class-validator'

@InputType('HealthDirectoratePatientDataPermitInput')
export class PermitInput {
  @Field()
  @IsISO8601()
  validFrom!: string

  @Field()
  @IsISO8601()
  validTo!: string

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  codes!: string[]

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  countryCodes!: string[]
}

@InputType('HealthDirectoratePatientDataPermitsInput')
export class PermitsInput {
  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  status!: string[]
}

@InputType('HealthDirectoratePatientDataInvalidatePermitInput')
export class InvalidatePermitInput {
  @Field()
  @IsString()
  id!: string
}
