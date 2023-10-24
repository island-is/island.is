import { ObjectType, Field } from '@nestjs/graphql'
import { DentistBill } from './bill.model'
import { DentistInformation } from './information.model'

@ObjectType('RightsPortalUserDentistRegistration')
export class DentistRegistration {
  @Field(() => DentistInformation, { nullable: true })
  dentist?: DentistInformation | null

  @Field(() => [DentistBill], { nullable: true })
  history?: Array<DentistBill> | null
}
