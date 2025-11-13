import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('IcelandicGovernmentInstitutionsEmployeesInput')
export class EmployeesInput {
  @IsString()
  @Field()
  organizationId!: string
}
