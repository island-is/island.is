import { Field, InputType } from '@nestjs/graphql'
import { GetOrganizationsByTypeTypeEnum } from './organization.enum'

@InputType('EducationFriggOrganizationInput')
export class FriggOrganizationInput {
  @Field(() => GetOrganizationsByTypeTypeEnum, { nullable: true })
  type?: GetOrganizationsByTypeTypeEnum

  @Field({ nullable: true })
  municipalityCode?: string

  @Field(() => [String], { nullable: true })
  gradeLevels?: string[]
}
