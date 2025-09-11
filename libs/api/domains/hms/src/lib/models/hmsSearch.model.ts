import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HmsSearchAddress')
export class Address {
  @Field(() => Number, { nullable: true })
  readonly addressCode?: number

  @Field(() => String, { nullable: true })
  readonly address?: string

  @Field(() => String, { nullable: true })
  readonly municipalityName?: string

  @Field(() => Number, { nullable: true })
  readonly municipalityCode?: number

  @Field(() => Number, { nullable: true })
  readonly postalCode?: number

  @Field(() => Number, { nullable: true })
  readonly landCode?: number

  @Field(() => String, { nullable: true })
  readonly streetName?: string

  @Field(() => Number, { nullable: true })
  readonly streetNumber?: number

  @Field(() => Number, { nullable: true })
  readonly numOfConnectedProperties?: number

  @Field(() => Number, { nullable: true })
  readonly propertyCode?: number
}

@ObjectType()
export class Addresses {
  @Field(() => [Address])
  addresses!: Address[]
}

@ObjectType('HmsPropertyCodeInfo')
export class PropertyCodeInfo {
  @Field(() => Address)
  address?: Address
}
