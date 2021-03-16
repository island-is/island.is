import { Allow } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FetchEducationSignedLicenseUrlInput {
  @Allow()
  @Field()
  readonly licenseId!: string
}
