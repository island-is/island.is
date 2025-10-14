import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('IcelandicGovernmentEmployeesInput')
export class EmployeesInput {
  @IsString()
  @Field()
  organizationId!: string
}
