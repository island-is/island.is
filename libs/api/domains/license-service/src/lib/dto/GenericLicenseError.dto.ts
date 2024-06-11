import { Field, ObjectType } from '@nestjs/graphql'
import { GenericLicenseType } from '../licenceService.type'

@ObjectType('GenericUserLicenseError')
export class LicenseError {
  @Field(() => GenericLicenseType)
  type!: GenericLicenseType

  @Field({ nullable: true, description: 'The error, raw' })
  error?: string
}
