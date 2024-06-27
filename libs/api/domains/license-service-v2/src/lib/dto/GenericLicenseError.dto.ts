import { Field, Int, ObjectType } from '@nestjs/graphql'
import { GenericLicenseType } from '../licenceService.type'
import { GenericLicenseProvider } from './GenericLicenseProvider.dto'

@ObjectType('LicenseServiceV2GenericUserLicenseError')
export class LicenseError {
  @Field(() => GenericLicenseType)
  type!: GenericLicenseType

  @Field(() => GenericLicenseProvider, { nullable: true })
  provider?: GenericLicenseProvider

  @Field(() => Int, { nullable: true })
  errorCode?: number

  @Field({ nullable: true })
  errorMessage?: string

  @Field({ nullable: true })
  extraData?: string
}
