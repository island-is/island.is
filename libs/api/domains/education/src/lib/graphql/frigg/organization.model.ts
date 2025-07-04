import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { AddressModel } from './address.model'

export enum OrganizationModelTypeEnum {
  ChildCare = 'childCare',
  Municipality = 'municipality',
  National = 'national',
  PrivateOwner = 'privateOwner',
  School = 'school',
}

registerEnumType(OrganizationModelTypeEnum, {
  name: 'OrganizationModelTypeEnum',
})

@ObjectType('EducationFriggOrganizationModel')
export class FriggOrganizationModel {
  @Field()
  id!: string

  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field(() => OrganizationModelTypeEnum)
  type!: OrganizationModelTypeEnum

  @Field(() => [String], { nullable: true })
  gradeLevels?: string[]

  @Field(() => [FriggOrganizationModel], { nullable: true })
  managing?: FriggOrganizationModel[]

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
