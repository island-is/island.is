import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PlateSize {
  @Field(() => String, { nullable: true })
  plateSizeType?: string | null

  @Field(() => Int, { nullable: true })
  plateHeight?: number | null

  @Field(() => Int, { nullable: true })
  plateWidth?: number | null
}

@ObjectType()
export class PlateOrderType {
  @Field(() => String, { nullable: true })
  plateTypeCode?: string | null

  @Field(() => String, { nullable: true })
  plateTypeName?: string | null

  @Field(() => [PlateSize], { nullable: true })
  plateSizes?: PlateSize[]
}

@ObjectType()
export class PlateOrderMatrix {
  @Field(() => [PlateOrderType], { nullable: true })
  plates?: PlateOrderType[]
}

@ObjectType()
export class VehicleCurrentPlates {
  @Field(() => String, { nullable: true })
  permno?: string | null

  @Field(() => String, { nullable: true })
  plateTypeCode?: string | null

  @Field(() => String, { nullable: true })
  plateTypeName?: string | null

  @Field(() => String, { nullable: true })
  plateStatusCode?: string | null

  @Field(() => String, { nullable: true })
  plateStatusName?: string | null
}
