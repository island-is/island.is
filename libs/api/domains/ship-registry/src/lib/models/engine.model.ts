import { Field, ObjectType } from '@nestjs/graphql'
import { ShipRegistryLocalizedValue } from './localizedValue.model'

@ObjectType('ShipRegistryEngine')
export class ShipRegistryEngine {
  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  name?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  year?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, {
    description: 'In kilowatts',
    nullable: true,
  })
  power?: ShipRegistryLocalizedValue
}
