import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalDentistRegisterResponse')
export class DentistRegisterResponse {
  @Field(() => Boolean)
  success!: boolean
}
