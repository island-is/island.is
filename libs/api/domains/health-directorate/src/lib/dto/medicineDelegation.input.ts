import { Field, InputType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator'

@InputType('HealthDirectorateMedicineDelegationInput')
export class MedicineDelegationInput {
  @Field(() => [String])
  @IsString({ each: true })
  status!: string[]
}

@InputType('HealthDirectorateMedicineDelegationCreateOrDeleteInput')
export class MedicineDelegationCreateOrDeleteInput {
  @Field()
  @IsString()
  nationalId!: string

  @Field()
  @IsDate()
  from?: Date

  @Field()
  @IsDate()
  to?: Date

  @Field({ nullable: true })
  @IsBoolean()
  lookup?: boolean
}

@InputType('HealthDirectorateMedicineDelegationCheckStepUpInput')
export class MedicineDelegationCheckStepUpInput {
  @Field()
  @IsString()
  @MaxLength(500)
  authReqId!: string

  /** The same input the step-up was started with: the authentication is bound to it. */
  @Field(() => MedicineDelegationCreateOrDeleteInput)
  @ValidateNested()
  @Type(() => MedicineDelegationCreateOrDeleteInput)
  delegation!: MedicineDelegationCreateOrDeleteInput
}
