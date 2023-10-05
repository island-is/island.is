import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalDentistRegisterInput')
export class DentistRegisterInput {
  @Field(() => Number)
  id!: number
}
