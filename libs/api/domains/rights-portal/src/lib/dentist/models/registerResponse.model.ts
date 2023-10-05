import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalRegisterDentistResponse')
export class RegisterDentistResponse {
  @Field(() => Boolean)
  success!: boolean
}
