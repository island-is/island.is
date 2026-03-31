import { Field, ObjectType } from '@nestjs/graphql'
import { ShipRegistryLocalizedValue } from './localizedValue.model'

@ObjectType('ShipRegistryFishery')
export class ShipRegistryFishery {
  @Field(() => ShipRegistryLocalizedValue)
  name!: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  address?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  municipality?: ShipRegistryLocalizedValue

  @Field(() => ShipRegistryLocalizedValue, { nullable: true })
  phoneNumber?: ShipRegistryLocalizedValue
}
