import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('RightsPortalDentistStatus')
export class DentistStatus {
  @Field(() => Boolean, { nullable: true })
  isInsured?: boolean | null

  @Field(() => Boolean, { nullable: true })
  canRegister?: boolean | null

  @Field(() => String, { nullable: true })
  contractType?: string | null
}
