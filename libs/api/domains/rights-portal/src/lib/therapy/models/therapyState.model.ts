import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalTherapyState')
export class TherapyState {
  @Field(() => String)
  display!: string

  @Field(() => String)
  code!: string
}
