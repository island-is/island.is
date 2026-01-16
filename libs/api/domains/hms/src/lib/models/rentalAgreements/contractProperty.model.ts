import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

@ObjectType('HmsContractProperty')
export class ContractProperty {
  @Field(() => ID)
  id!: number

  @Field(() => Int)
  propertyId!: number

  @Field(() => PropertyType, { nullable: true })
  type?: PropertyType

  @Field(() => Int, { nullable: true })
  postalCode?: number

  @Field({ nullable: true })
  streetAndHouseNumber?: string

  @Field({ nullable: true })
  municipality?: string
}

export enum PropertyType {
  INDIVIDUAL_ROOM = 'individualRoom',
  RESIDENTIAL = 'residential',
  NONRESIDENTIAL = 'nonResidential',
  UNKNOWN = 'unknown',
}

registerEnumType(PropertyType, {
  name: 'HmsRentalAgreementPropertyType',
})
