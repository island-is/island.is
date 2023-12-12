import { ObjectType, Field } from '@nestjs/graphql'
import { DentistStatus } from './status.model'

@ObjectType('RightsPortalUserDentistInformation')
export class DentistInformation {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => Number, { nullable: true })
  id?: number | null

  @Field(() => DentistStatus, { nullable: true })
  status?: DentistStatus | null
}
