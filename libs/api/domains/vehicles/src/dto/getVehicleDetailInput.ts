import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetVehicleDetailInput {
  @Field()
  permno!: string

  @Field({ nullable: true })
  regno?: string

  @Field({ nullable: true })
  vin?: string
}
