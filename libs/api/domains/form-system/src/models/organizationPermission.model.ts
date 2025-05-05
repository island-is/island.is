import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('FormSystemOrganizationPermissionDto')
export class OrganizationPermissionDto {
  @Field(() => String, { nullable: true })
  permission?: string
}
