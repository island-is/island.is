import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class BasicVehicleInformation {
  @Field(() => String, { nullable: true })
  permno?: string | null

  @Field(() => String, { nullable: true })
  make?: string | null

  @Field(() => String, { nullable: true })
  color?: string | null
}
