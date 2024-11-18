import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PlateOrderAnswersPickVehicle {
  @Field(() => String, { nullable: false })
  plate!: string
}

@InputType()
export class PlateOrderAnswersPlateSize {
  @Field(() => [String], { nullable: true })
  frontPlateSize?: string[]

  @Field(() => [String], { nullable: true })
  rearPlateSize?: string[]
}

@InputType()
export class OperatorChangeAnswersPlateDelivery {
  @Field(() => String, { nullable: true })
  deliveryMethodIsDeliveryStation?: string

  @Field(() => String, { nullable: true })
  deliveryStationTypeCode?: string

  @Field(() => [String], { nullable: true })
  includeRushFee?: string[]
}

@InputType()
export class PlateOrderAnswers {
  @Field(() => PlateOrderAnswersPickVehicle, { nullable: false })
  pickVehicle!: PlateOrderAnswersPickVehicle

  @Field(() => PlateOrderAnswersPlateSize, { nullable: false })
  plateSize!: PlateOrderAnswersPlateSize

  @Field(() => OperatorChangeAnswersPlateDelivery, { nullable: false })
  plateDelivery!: OperatorChangeAnswersPlateDelivery
}
