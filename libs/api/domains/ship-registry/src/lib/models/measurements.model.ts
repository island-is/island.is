import { Field, ObjectType } from '@nestjs/graphql'
import { ShipRegistryLocalizedValue } from './localizedValue.model'

@ObjectType('ShipRegistryMeasurements')
export class ShipRegistryMeasurements {
  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  length?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  maxLength?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  width?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  depth?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  bruttoGrossTonnage?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  bruttoWeight?: ShipRegistryLocalizedValue
}
