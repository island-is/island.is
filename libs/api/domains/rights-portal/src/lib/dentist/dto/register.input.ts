import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalRegisterDentistInput')
export class RegisterDentistInput {
  @Field(() => Number)
  id!: number
}
