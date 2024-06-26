import { Field, ObjectType } from '@nestjs/graphql'
import { GenericUserLicense } from './GenericUserLicense.dto'

@ObjectType('GenericUserLicenseResponse')
export class UserLicensesResponse {
  @Field({
    nullable: true,
    description: 'National ID of licenses owner',
    deprecationReason: 'Unnecessary',
  })
  nationalId?: string

  @Field(() => [GenericUserLicense], {
    description: 'All of the users licenses',
  })
  licenses!: Array<GenericUserLicense>

  @Field(() => [GenericUserLicense], {
    description: 'The users children licenses',
  })
  childrenLicenses?: Array<GenericUserLicense>
}
