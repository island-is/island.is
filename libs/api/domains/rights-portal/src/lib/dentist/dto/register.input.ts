import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('RightsPortalDentistRegisterInput')
export class DentistRegisterInput {
  @Field(() => ID)
  id!: number
}
