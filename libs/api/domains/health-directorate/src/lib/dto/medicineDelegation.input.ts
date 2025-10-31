import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsDate, IsString } from 'class-validator'

@InputType('HealthDirectorateMedicineDelegationInput')
export class MedicineDelegationInput {
  @Field()
  @IsBoolean()
  active!: boolean
}

@InputType('HealthDirectorateMedicineDelegationCreateInput')
export class MedicineDelegationCreateInput {
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

@InputType('HealthDirectorateMedicineDelegationDeleteInput')
export class MedicineDelegationDeleteInput {
  @Field()
  @IsString()
  nationalId!: string
}
