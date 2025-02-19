import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { OrganizationDto } from './organization.dto'

@ObjectType('FormSystemOrganizationsResponse')
export class OrganizationsResponseDto {
  @ApiProperty({ type: [OrganizationDto] })
  @Field(() => [OrganizationDto])
  organizations!: OrganizationDto[]
}
