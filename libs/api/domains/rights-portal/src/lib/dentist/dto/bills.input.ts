import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalDentistBillsInput')
export class DentistBillsInput {
  @Field(() => Date, { nullable: true })
  dateFrom?: Date

  @Field(() => Date, { nullable: true })
  dateTo?: Date
}
