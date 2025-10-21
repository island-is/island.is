import { Field, ObjectType } from '@nestjs/graphql'
import {
  GetOrganizationsByTypeTypeEnum,
  OrganizationModelSectorEnum,
  OrganizationModelSubTypeEnum,
} from './organization.enum'

@ObjectType('EducationFriggOrganization')
export class FriggOrganization {
  @Field()
  id!: string

  @Field()
  name!: string

  @Field(() => GetOrganizationsByTypeTypeEnum)
  type!: GetOrganizationsByTypeTypeEnum

  @Field(() => OrganizationModelSubTypeEnum, { nullable: true })
  subType?: OrganizationModelSubTypeEnum

  @Field(() => OrganizationModelSectorEnum, { nullable: true })
  sector?: OrganizationModelSectorEnum

  @Field(() => [String], { nullable: true })
  gradeLevels?: string[]

  @Field({ nullable: true })
  unitId?: string
}
