import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ShipRegistryLocalizedValue')
export class ShipRegistryLocalizedValue {
  @Field()
  label!: string

  @Field({ nullable: true })
  value?: string

  @Field({ nullable: true })
  unit?: string
}
