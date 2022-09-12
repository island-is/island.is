import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetQuotaTypesForCalendarYear {
  @Field()
  year!: string
}
