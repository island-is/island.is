import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FiskistofaGetQuotaTypesForCalendarYearInput {
  @Field()
  year!: string
}
