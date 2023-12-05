import { Field, ID, ObjectType } from '@nestjs/graphql'

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

  @Field(() => ID, { nullable: true })
  internalId?: number | null
}

@ObjectType()
export class VehicleMileageOverview {
  @Field(() => [VehicleMileageDetail], { nullable: true })
  data?: VehicleMileageDetail[]

  @Field(() => Boolean, {
    nullable: true,
    description:
      'Indicates that the user has already posted a reading today. So instead of posting a new reading, should be editing the reading from today',
  })
  editing?: boolean | null

  @Field(() => String, { nullable: true })
  permno?: string

  @Field(() => Boolean, { nullable: true })
  canRegisterMileage?: boolean | null

  @Field(() => Boolean, { nullable: true })
  requiresMileageRegistration?: boolean | null
}

@ObjectType()
export class VehicleMileagePutModel {
  @Field(() => String, { nullable: true })
  permno?: string

  @Field(() => ID, { nullable: true })
  internalId?: number

  @Field(() => String, { nullable: true })
  mileage?: string
}

@ObjectType()
export class VehicleMileageError {
  @Field(() => Number, { nullable: true })
  lookupNo?: number | null

  @Field(() => String, { nullable: true })
  warnSever?: string | null

  @Field(() => String, { nullable: true })
  errorMess?: string | null

  @Field(() => String, { nullable: true })
  permno?: string | null

  @Field(() => Number, { nullable: true })
  warningSerialNumber?: number | null
}
