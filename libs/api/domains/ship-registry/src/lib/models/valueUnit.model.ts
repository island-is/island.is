import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ShipRegistryValueUnit {
  @Field()
  value!: string

  @Field({ nullable: true })
  unit?: string
}
