import { Field, InputType, Int } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('IcelandicGovernmentEmployeesInput')
export class EmployeesInput {
  @IsString()
  @Field()
  organizationId!: string

}
