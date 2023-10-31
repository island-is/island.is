import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehicleMileageDetail {
  @Field(() => String, { nullable: true })
  permno?: string | null

  @Field(() => Date, { nullable: true })
  readDate?: Date | null

  @Field(() => String, { nullable: true })
  originCode?: string | null

  @Field(() => String, { nullable: true })
  mileage?: string | null
}
