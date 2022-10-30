import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetBrokenDownElectronicRegistrationStatisticsInput {
  @Field()
  year!: number
}
