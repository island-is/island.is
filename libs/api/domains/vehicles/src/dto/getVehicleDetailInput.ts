import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetVehicleDetailInput {
  @Field({ nullable: true })
  permno?: string

  @Field()
  regno!: string

  @Field({ nullable: true })
  vin?: string
}
