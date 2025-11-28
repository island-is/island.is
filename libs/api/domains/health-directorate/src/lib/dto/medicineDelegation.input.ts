import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsDate, IsString } from 'class-validator'

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
