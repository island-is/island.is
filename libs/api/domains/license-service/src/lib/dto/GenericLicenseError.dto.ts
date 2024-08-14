import { Field, Int, ObjectType } from '@nestjs/graphql'
import { GenericLicenseType } from '../licenceService.type'
import { GenericLicenseProvider } from './GenericLicenseProvider.dto'
import { GenericLicenseFetch } from './GenericLicenseFetch.dto'

@ObjectType('GenericLicenseError')
export class GenericLicenseError {
  @Field(() => GenericLicenseType)
  type!: GenericLicenseType

  @Field(() => GenericLicenseFetch, { description: 'Info about license fetch' })
  fetch!: GenericLicenseFetch

  @Field(() => GenericLicenseProvider, { nullable: true })
  provider?: GenericLicenseProvider

  @Field(() => Int, { nullable: true })
  code?: number

  @Field({ nullable: true })
  message?: string

  @Field({ nullable: true })
  extraData?: string
}
