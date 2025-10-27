import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean } from 'class-validator'

@InputType('HealthDirectorateMedicineDelegationInput')
export class MedicineDelegationInput {
  @Field()
  @IsBoolean()
  active!: boolean
}
