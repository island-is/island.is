import { Field, InputType } from '@nestjs/graphql'

@InputType('DentistBillsInput')
export class GetDentistBillsInput {
  @Field(() => Date, { nullable: true })
  dateFrom?: Date

  @Field(() => Date, { nullable: true })
  dateTo?: Date
}
