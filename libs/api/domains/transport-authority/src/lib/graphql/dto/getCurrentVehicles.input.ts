import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetCurrentVehiclesInput {
  @Field()
  showOwned!: boolean

  @Field()
  showCoOwned!: boolean

  @Field()
  showOperated!: boolean
}
