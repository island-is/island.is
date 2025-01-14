import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum OrganizationModelTypeEnum {
  Municipality = 'municipality',
  National = 'national',
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
  children?: FriggOrganizationModel[]
}
