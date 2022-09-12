import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetQuotaTypesForCalendarYearInput {
  @Field()
  year!: string
}
