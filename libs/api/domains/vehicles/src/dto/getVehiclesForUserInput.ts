import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetVehiclesForUserInput {
  @Field()
  nationalId!: string
}
