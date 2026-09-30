import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('VmstApplicationsU2ValidationInput')
export class VmstApplicationsU2ValidationInput {
  @Field()
  @IsString()
  dateWhenLeaving!: string

  @Field()
  @IsString()
  destinationCountryId!: string
}
