import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('LicenseDefaultLicenseData')
export class DefaultLicenseData {
  @Field(() => String, { nullable: true })
  value?: string
}
