import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { AddressModel } from './address.model'

export enum OrganizationTypeEnum {
  ChildCare = 'childCare',
  Municipality = 'municipality',
  National = 'national',
  PrivateOwner = 'privateOwner',
  School = 'school',
}

registerEnumType(OrganizationTypeEnum, {
  name: 'OrganizationTypeEnum',
})

@ObjectType('EducationFriggOrganization')
export class FriggOrganization {
  @Field()
  id!: string

  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field(() => OrganizationTypeEnum)
  type!: OrganizationTypeEnum

  @Field(() => [String], { nullable: true })
  gradeLevels?: string[]

  @Field(() => [FriggOrganization], { nullable: true })
  managing?: FriggOrganization[]

  @Field({ nullable: true })
  unitId?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  website?: string

  @Field(() => AddressModel, { nullable: true })
  address?: AddressModel
}
