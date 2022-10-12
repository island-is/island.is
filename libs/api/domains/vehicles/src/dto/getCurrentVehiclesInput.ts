import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetCurrentVehiclesInput {
  @Field()
  showOwned!: boolean

  @Field()
  showCoowned!: boolean

  @Field()
  showOperated!: boolean
}
