import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AircraftRegistryPerson')
class Person {
  @Field(() => String, { nullable: true })
  address?: string | null

  @Field(() => String, { nullable: true })
  city?: string | null

  @Field(() => String, { nullable: true })
  country?: string | null

  @Field(() => String, { nullable: true })
  email?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  phone?: string | null

  @Field(() => String, { nullable: true })
  postcode?: string | null

  @Field(() => Number, { nullable: true })
  ssn?: number | null
}

@ObjectType('AircraftRegistryAircraft')
export class Aircraft {
  @Field(() => String, { nullable: true })
  identifiers?: string | null

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => Number, { nullable: true })
  maxWeight?: number | null

  @CacheField(() => Person, { nullable: true })
  operator?: Person | null

  @CacheField(() => [Person], { nullable: true })
  owners?: Person[] | null

  @Field(() => Number, { nullable: true })
  productionYear?: number | null

  @Field(() => Number, { nullable: true })
  registrationNumber?: number | null

  @Field(() => String, { nullable: true })
  serialNumber?: string | null

  @Field(() => Boolean, { nullable: true })
  unregistered?: boolean | null

  @Field(() => Date, { nullable: true })
  unregisteredDate?: Date | null
}
